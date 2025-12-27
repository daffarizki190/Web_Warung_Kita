CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'cashier', -- 'admin', 'cashier'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  base_price NUMERIC NOT NULL,
  selling_price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total NUMERIC NOT NULL,
  amount_paid NUMERIC NOT NULL,
  change_amount NUMERIC NOT NULL,
  payment_method VARCHAR(20) NOT NULL, -- 'cash', 'debt'
  customer_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transaction_items (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  qty INTEGER NOT NULL,
  price_at_sale NUMERIC NOT NULL
);

CREATE TABLE IF NOT EXISTS debts (
  id SERIAL PRIMARY KEY,
  transaction_id INTEGER REFERENCES transactions(id),
  customer_name VARCHAR(100) NOT NULL,
  amount NUMERIC NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS store_profile (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) DEFAULT 'Warung Daffa',
  address TEXT DEFAULT 'Jl. Contoh No. 123',
  whatsapp VARCHAR(20) DEFAULT '081234567890'
);

-- Initial Data
INSERT INTO store_profile (name, address, whatsapp)
SELECT 'Warung Daffa', 'Jl. Contoh No. 123', '081234567890'
WHERE NOT EXISTS (SELECT 1 FROM store_profile);

-- Default Admin User (password: password123)
-- Hash generated for 'password123'
INSERT INTO users (username, password_hash, role)
SELECT 'admin', '$2a$10$wS2/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');
