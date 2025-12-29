import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

app.use(cors());
app.use(express.json());

// Initialize Database Schema
const initDb = async () => {
  try {
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await db.query(schemaSql);
    
    const adminCheck = await db.query("SELECT * FROM users WHERE username = 'admin'");
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password123', salt);
    if (adminCheck.rows.length === 0) {
      await db.query("INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)", ['admin', hash, 'admin']);
    } else {
      await db.query("UPDATE users SET password_hash=$1, role=$2 WHERE username='admin'", [hash, 'admin']);
    }
    const seeds = [
      { username: 'Mamah', password: 'mamah123', role: 'cashier' },
      { username: 'Bapak', password: 'bapak123', role: 'cashier' },
      { username: 'Diva', password: 'diva123', role: 'cashier' },
      { username: 'Daffa', password: 'daffa123', role: 'cashier' },
      { username: 'Faris', password: 'faris123', role: 'cashier' },
    ];
    for (const s of seeds) {
      const exists = await db.query('SELECT 1 FROM users WHERE username=$1', [s.username]);
      if (exists.rows.length === 0) {
        const shash = await bcrypt.hash(s.password, await bcrypt.genSalt(10));
        await db.query('INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)', [s.username, shash, s.role]);
      }
    }
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'User not found' });
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/register', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Only admin can create users' });
  const { username, password, role } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const result = await db.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hash, role || 'cashier']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    const result = await db.query('SELECT id, username, role, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PRODUCT ROUTES ---
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', authenticateToken, async (req, res) => {
  const { name, category, basePrice, sellingPrice, stock } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO products (name, category, base_price, selling_price, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, category, basePrice, sellingPrice, stock]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', authenticateToken, async (req, res) => {
  const { name, category, basePrice, sellingPrice, stock } = req.body;
  try {
    const result = await db.query(
      'UPDATE products SET name=$1, category=$2, base_price=$3, selling_price=$4, stock=$5 WHERE id=$6 RETURNING *',
      [name, category, basePrice, sellingPrice, stock, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- TRANSACTION ROUTES ---
app.get('/api/transactions', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT t.*, 
             (SELECT json_agg(ti) FROM transaction_items ti WHERE ti.transaction_id = t.id) as items 
      FROM transactions t 
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/transactions', authenticateToken, async (req, res) => {
  const { items, total, amountPaid, change, paymentMethod, customerName } = req.body;
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const transRes = await client.query(
      'INSERT INTO transactions (user_id, total, amount_paid, change_amount, payment_method, customer_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [req.user.id, total, amountPaid, change, paymentMethod, customerName]
    );
    const transactionId = transRes.rows[0].id;
    for (const item of items) {
      await client.query(
        'INSERT INTO transaction_items (transaction_id, product_id, qty, price_at_sale) VALUES ($1, $2, $3, $4)',
        [transactionId, item.id, item.qty, item.sellingPrice]
      );
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.qty, item.id]
      );
    }
    if (paymentMethod === 'debt') {
      await client.query(
        'INSERT INTO debts (transaction_id, customer_name, amount, is_paid) VALUES ($1, $2, $3, $4)',
        [transactionId, customerName, total, false]
      );
    }
    await client.query('COMMIT');
    res.json({ message: 'Transaction successful', transactionId });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// --- DEBT ROUTES ---
app.get('/api/debts', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM debts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/debts/:id/pay', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE debts SET is_paid = TRUE WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROFILE ROUTES ---
app.get('/api/profile', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM store_profile LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  const { name, address, whatsapp } = req.body;
  try {
    const result = await db.query(
      'UPDATE store_profile SET name=$1, address=$2, whatsapp=$3 RETURNING *',
      [name, address, whatsapp]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/account/password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const userRes = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Invalid current password' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { app, initDb };
