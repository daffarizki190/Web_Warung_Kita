export const schemaSql = `
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
INSERT INTO users (username, password_hash, role)
SELECT 'admin', '$2a$10$wS2/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w/7w', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- SEED DATA: Produk Warung Sembako
-- Sembako
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Minyak Goreng Curah 1kg', 'Sembako', 14000, 16000, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Minyak Goreng Curah 1kg');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Gula Pasir Curah 1kg', 'Sembako', 15000, 17000, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Gula Pasir Curah 1kg');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Telur Ayam Negeri 1kg', 'Sembako', 28000, 30000, 30 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Telur Ayam Negeri 1kg');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Garam Halus 250g', 'Sembako', 2000, 3000, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Garam Halus 250g');

-- Makanan Instan
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Indomie Goreng', 'Makanan Instan', 2800, 3500, 100 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Indomie Goreng');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Indomie Soto Mie', 'Makanan Instan', 2800, 3500, 80 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Indomie Soto Mie');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Indomie Ayam Bawang', 'Makanan Instan', 2800, 3500, 80 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Indomie Ayam Bawang');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Indomie Kari Ayam', 'Makanan Instan', 3000, 3500, 80 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Indomie Kari Ayam');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Mie Sedaap Goreng', 'Makanan Instan', 2800, 3500, 80 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Mie Sedaap Goreng');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Sarden ABC Kecil', 'Makanan Instan', 10000, 12000, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sarden ABC Kecil');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Bubur Sun', 'Makanan Instan', 5000, 6000, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Bubur Sun');

-- Minuman
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Kopi Kapal Api Special Mix', 'Minuman', 1500, 2000, 100 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kopi Kapal Api Special Mix');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Kopi Good Day Cappuccino', 'Minuman', 2000, 2500, 100 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kopi Good Day Cappuccino');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Kopi Torabika Duo', 'Minuman', 1500, 2000, 100 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kopi Torabika Duo');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Luwak White Koffie', 'Minuman', 2000, 2500, 100 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Luwak White Koffie');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Teh Celup Sariwangi (Box)', 'Minuman', 6000, 7500, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Teh Celup Sariwangi (Box)');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Teh Pucuk Harum 350ml', 'Minuman', 3000, 4000, 48 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Teh Pucuk Harum 350ml');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Teh Kotak 300ml', 'Minuman', 4000, 5000, 48 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Teh Kotak 300ml');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Aqua Botol 600ml', 'Minuman', 3000, 4000, 48 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Aqua Botol 600ml');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Le Minerale 600ml', 'Minuman', 3000, 4000, 48 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Le Minerale 600ml');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Pocari Sweat 500ml', 'Minuman', 6000, 7500, 24 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pocari Sweat 500ml');

-- Bumbu Dapur
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Kecap Bango 220ml', 'Bumbu Dapur', 10000, 12000, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kecap Bango 220ml');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Kecap ABC 135ml', 'Bumbu Dapur', 6000, 7500, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kecap ABC 135ml');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Saus Sambal ABC 135ml', 'Bumbu Dapur', 5000, 6500, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Saus Sambal ABC 135ml');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Masako Ayam Sachet', 'Bumbu Dapur', 500, 1000, 100 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Masako Ayam Sachet');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Masako Sapi Sachet', 'Bumbu Dapur', 500, 1000, 100 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Masako Sapi Sachet');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Ladaku Merica Bubuk', 'Bumbu Dapur', 1000, 1500, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Ladaku Merica Bubuk');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Kara Santan 65ml', 'Bumbu Dapur', 3000, 3500, 40 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kara Santan 65ml');

-- Perlengkapan Mandi & Cuci
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Sabun Lifebuoy Batang', 'Perlengkapan', 3500, 4500, 40 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sabun Lifebuoy Batang');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Sabun Nuvo Batang', 'Perlengkapan', 3000, 4000, 40 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sabun Nuvo Batang');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Sampo Lifebuoy Sachet', 'Perlengkapan', 500, 1000, 100 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sampo Lifebuoy Sachet');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Sampo Clear Sachet', 'Perlengkapan', 500, 1000, 100 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sampo Clear Sachet');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Pasta Gigi Pepsodent 75g', 'Perlengkapan', 4000, 5000, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Pasta Gigi Pepsodent 75g');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Deterjen Rinso Anti Noda 770g', 'Perlengkapan', 20000, 23000, 10 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Deterjen Rinso Anti Noda 770g');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Deterjen Daia 850g', 'Perlengkapan', 18000, 20000, 10 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Deterjen Daia 850g');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'So Klin Pewangi Sachet', 'Perlengkapan', 500, 1000, 100 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'So Klin Pewangi Sachet');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Sunlight 210ml', 'Perlengkapan', 4000, 5000, 24 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sunlight 210ml');

-- Makanan Ringan
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Beng-Beng', 'Snack', 2000, 2500, 40 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Beng-Beng');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Better', 'Snack', 2000, 2500, 40 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Better');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Biskuat Coklat', 'Snack', 1000, 2000, 40 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Biskuat Coklat');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Roma Kelapa', 'Snack', 8000, 9500, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Roma Kelapa');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Taro Net', 'Snack', 4000, 5000, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Taro Net');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Chiki Balls', 'Snack', 4000, 5000, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Chiki Balls');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Kacang Garuda Rosta', 'Snack', 2000, 3000, 30 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Kacang Garuda Rosta');

-- Rokok
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Sampoerna Mild 16', 'Rokok', 28000, 30000, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Sampoerna Mild 16');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Djarum Super 12', 'Rokok', 22000, 24000, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Djarum Super 12');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Gudang Garam Filter 12', 'Rokok', 22000, 24000, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Gudang Garam Filter 12');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Gudang Garam Surya 16', 'Rokok', 28000, 30000, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Gudang Garam Surya 16');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'LA Lights 16', 'Rokok', 27000, 29000, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'LA Lights 16');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Magnum Filter', 'Rokok', 20000, 22000, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Magnum Filter');

-- Lain-lain
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Gas Elpiji 3kg', 'Gas & Galon', 18000, 22000, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Gas Elpiji 3kg');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Air Galon Aqua (Isi Ulang)', 'Gas & Galon', 18000, 20000, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Air Galon Aqua (Isi Ulang)');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Obat Bodrex (Tablet)', 'Obat', 500, 1000, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Obat Bodrex (Tablet)');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Obat Paramex (Tablet)', 'Obat', 2000, 2500, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Obat Paramex (Tablet)');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Tolak Angin Sachet', 'Obat', 3500, 4500, 50 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Tolak Angin Sachet');
INSERT INTO products (name, category, base_price, selling_price, stock) SELECT 'Minyak Kayu Putih Cap Lang 60ml', 'Obat', 20000, 23000, 20 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'Minyak Kayu Putih Cap Lang 60ml');
`;
