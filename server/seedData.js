export const products = [
  // Sembako
  { name: 'Beras 1kg', category: 'Sembako', basePrice: 14000, sellingPrice: 15000, stock: 40 },
  { name: 'Beras 1/2kg', category: 'Sembako', basePrice: 7000, sellingPrice: 7500, stock: 60 },
  { name: 'Beras 1/4kg', category: 'Sembako', basePrice: 3500, sellingPrice: 3750, stock: 80 },
  { name: 'Gula 1kg', category: 'Sembako', basePrice: 15000, sellingPrice: 17000, stock: 60 },
  { name: 'Gula 1/2kg', category: 'Sembako', basePrice: 7500, sellingPrice: 8500, stock: 80 },
  { name: 'Gula 1/4kg', category: 'Sembako', basePrice: 3750, sellingPrice: 4250, stock: 100 },
  { name: 'Minyak Goreng 1kg', category: 'Sembako', basePrice: 14000, sellingPrice: 16000, stock: 50 },
  { name: 'Minyak Goreng 1/2kg', category: 'Sembako', basePrice: 7000, sellingPrice: 8000, stock: 60 },
  { name: 'Minyak Goreng 1/4kg', category: 'Sembako', basePrice: 3500, sellingPrice: 4000, stock: 80 },
  { name: 'Telur Ayam Negeri 1kg', category: 'Sembako', basePrice: 28000, sellingPrice: 30000, stock: 30 },
  { name: 'Tepung Terigu 1kg', category: 'Sembako', basePrice: 12000, sellingPrice: 14000, stock: 40 },
  { name: 'Garam Halus 250g', category: 'Sembako', basePrice: 2000, sellingPrice: 3000, stock: 50 },

  // Makanan Instan
  { name: 'Indomie Goreng', category: 'Makanan Instan', basePrice: 2800, sellingPrice: 3500, stock: 100 },
  { name: 'Indomie Soto Mie', category: 'Makanan Instan', basePrice: 2800, sellingPrice: 3500, stock: 80 },
  { name: 'Indomie Ayam Bawang', category: 'Makanan Instan', basePrice: 2800, sellingPrice: 3500, stock: 80 },
  { name: 'Indomie Kari Ayam', category: 'Makanan Instan', basePrice: 3000, sellingPrice: 3500, stock: 80 },
  { name: 'Mie Sedaap Goreng', category: 'Makanan Instan', basePrice: 2800, sellingPrice: 3500, stock: 80 },
  { name: 'Sarden ABC Kecil', category: 'Makanan Instan', basePrice: 10000, sellingPrice: 12000, stock: 20 },
  { name: 'Bubur Sun', category: 'Makanan Instan', basePrice: 5000, sellingPrice: 6000, stock: 20 },

  // Minuman
  { name: 'Kopi Kapal Api Special Mix', category: 'Minuman', basePrice: 1500, sellingPrice: 2000, stock: 100 },
  { name: 'Kopi Good Day Cappuccino', category: 'Minuman', basePrice: 2000, sellingPrice: 2500, stock: 100 },
  { name: 'Kopi Torabika Duo', category: 'Minuman', basePrice: 1500, sellingPrice: 2000, stock: 100 },
  { name: 'Luwak White Koffie', category: 'Minuman', basePrice: 2000, sellingPrice: 2500, stock: 100 },
  { name: 'Teh Celup Sariwangi (Box)', category: 'Minuman', basePrice: 6000, sellingPrice: 7500, stock: 20 },
  { name: 'Teh Pucuk Harum 350ml', category: 'Minuman', basePrice: 3000, sellingPrice: 4000, stock: 48 },
  { name: 'Teh Kotak 300ml', category: 'Minuman', basePrice: 4000, sellingPrice: 5000, stock: 48 },
  { name: 'Aqua Botol 600ml', category: 'Minuman', basePrice: 3000, sellingPrice: 4000, stock: 48 },
  { name: 'Le Minerale 600ml', category: 'Minuman', basePrice: 3000, sellingPrice: 4000, stock: 48 },
  { name: 'Pocari Sweat 500ml', category: 'Minuman', basePrice: 6000, sellingPrice: 7500, stock: 24 },

  // Bumbu Dapur
  { name: 'Kecap Bango 220ml', category: 'Bumbu Dapur', basePrice: 10000, sellingPrice: 12000, stock: 20 },
  { name: 'Kecap ABC 135ml', category: 'Bumbu Dapur', basePrice: 6000, sellingPrice: 7500, stock: 20 },
  { name: 'Saus Sambal ABC 135ml', category: 'Bumbu Dapur', basePrice: 5000, sellingPrice: 6500, stock: 20 },
  { name: 'Masako Ayam Sachet', category: 'Bumbu Dapur', basePrice: 500, sellingPrice: 1000, stock: 100 },
  { name: 'Masako Sapi Sachet', category: 'Bumbu Dapur', basePrice: 500, sellingPrice: 1000, stock: 100 },
  { name: 'Ladaku Merica Bubuk', category: 'Bumbu Dapur', basePrice: 1000, sellingPrice: 1500, stock: 50 },
  { name: 'Kara Santan 65ml', category: 'Bumbu Dapur', basePrice: 3000, sellingPrice: 3500, stock: 40 },

  // Perlengkapan Mandi & Cuci
  { name: 'Sabun Lifebuoy Batang', category: 'Perlengkapan', basePrice: 3500, sellingPrice: 4500, stock: 40 },
  { name: 'Sabun Nuvo Batang', category: 'Perlengkapan', basePrice: 3000, sellingPrice: 4000, stock: 40 },
  { name: 'Sampo Lifebuoy Sachet', category: 'Perlengkapan', basePrice: 500, sellingPrice: 1000, stock: 100 },
  { name: 'Sampo Clear Sachet', category: 'Perlengkapan', basePrice: 500, sellingPrice: 1000, stock: 100 },
  { name: 'Pasta Gigi Pepsodent 75g', category: 'Perlengkapan', basePrice: 4000, sellingPrice: 5000, stock: 20 },
  { name: 'Deterjen Rinso Anti Noda 770g', category: 'Perlengkapan', basePrice: 20000, sellingPrice: 23000, stock: 10 },
  { name: 'Deterjen Daia 850g', category: 'Perlengkapan', basePrice: 18000, sellingPrice: 20000, stock: 10 },
  { name: 'So Klin Pewangi Sachet', category: 'Perlengkapan', basePrice: 500, sellingPrice: 1000, stock: 100 },
  { name: 'Sunlight 210ml', category: 'Perlengkapan', basePrice: 4000, sellingPrice: 5000, stock: 24 },

  // Makanan Ringan (Snack)
  { name: 'Beng-Beng', category: 'Snack', basePrice: 2000, sellingPrice: 2500, stock: 40 },
  { name: 'Better', category: 'Snack', basePrice: 2000, sellingPrice: 2500, stock: 40 },
  { name: 'Biskuat Coklat', category: 'Snack', basePrice: 1000, sellingPrice: 2000, stock: 40 },
  { name: 'Roma Kelapa', category: 'Snack', basePrice: 8000, sellingPrice: 9500, stock: 20 },
  { name: 'Taro Net', category: 'Snack', basePrice: 4000, sellingPrice: 5000, stock: 20 },
  { name: 'Chiki Balls', category: 'Snack', basePrice: 4000, sellingPrice: 5000, stock: 20 },
  { name: 'Kacang Garuda Rosta', category: 'Snack', basePrice: 2000, sellingPrice: 3000, stock: 30 },

  // Rokok
  { name: 'Sampoerna Mild 16', category: 'Rokok', basePrice: 28000, sellingPrice: 30000, stock: 50 },
  { name: 'Djarum Super 12', category: 'Rokok', basePrice: 22000, sellingPrice: 24000, stock: 50 },
  { name: 'Gudang Garam Filter 12', category: 'Rokok', basePrice: 22000, sellingPrice: 24000, stock: 50 },
  { name: 'Gudang Garam Surya 16', category: 'Rokok', basePrice: 28000, sellingPrice: 30000, stock: 50 },
  { name: 'LA Lights 16', category: 'Rokok', basePrice: 27000, sellingPrice: 29000, stock: 50 },
  { name: 'Magnum Filter', category: 'Rokok', basePrice: 20000, sellingPrice: 22000, stock: 50 },

  // Lain-lain
  { name: 'Gas Elpiji 3kg', category: 'Gas & Galon', basePrice: 18000, sellingPrice: 22000, stock: 20 },
  { name: 'Air Galon Aqua (Isi Ulang)', category: 'Gas & Galon', basePrice: 18000, sellingPrice: 20000, stock: 20 },
  { name: 'Obat Bodrex (Tablet)', category: 'Obat', basePrice: 500, sellingPrice: 1000, stock: 50 },
  { name: 'Obat Paramex (Tablet)', category: 'Obat', basePrice: 2000, sellingPrice: 2500, stock: 50 },
  { name: 'Tolak Angin Sachet', category: 'Obat', basePrice: 3500, sellingPrice: 4500, stock: 50 },
  { name: 'Minyak Kayu Putih Cap Lang 60ml', category: 'Obat', basePrice: 20000, sellingPrice: 23000, stock: 20 },
  
  // Eceran Sembako (berat 1kg, 1/2kg, 1/4kg)
  { name: 'Beras 1kg', category: 'Sembako', basePrice: 14000, sellingPrice: 15000, stock: 40 },
  { name: 'Beras 1/2kg', category: 'Sembako', basePrice: 7000, sellingPrice: 7500, stock: 60 },
  { name: 'Beras 1/4kg', category: 'Sembako', basePrice: 3500, sellingPrice: 3750, stock: 80 },
  
  // Gula generic eceran
  { name: 'Gula 1kg', category: 'Sembako', basePrice: 15000, sellingPrice: 17000, stock: 60 },
  { name: 'Gula 1/2kg', category: 'Sembako', basePrice: 7500, sellingPrice: 8500, stock: 80 },
  { name: 'Gula 1/4kg', category: 'Sembako', basePrice: 3750, sellingPrice: 4250, stock: 100 },
  
  // Minyak goreng generic eceran (curah dihitung kg)
  { name: 'Minyak Goreng 1kg', category: 'Sembako', basePrice: 14000, sellingPrice: 16000, stock: 50 },
  { name: 'Minyak Goreng 1/2kg', category: 'Sembako', basePrice: 7000, sellingPrice: 8000, stock: 60 },
  { name: 'Minyak Goreng 1/4kg', category: 'Sembako', basePrice: 3500, sellingPrice: 4000, stock: 80 },
  
  // Tepung Terigu generic eceran
  { name: 'Tepung Terigu 1kg', category: 'Sembako', basePrice: 12000, sellingPrice: 14000, stock: 40 },
  { name: 'Tepung Terigu 1/2kg', category: 'Sembako', basePrice: 6000, sellingPrice: 7000, stock: 50 },
  { name: 'Tepung Terigu 1/4kg', category: 'Sembako', basePrice: 3000, sellingPrice: 3500, stock: 70 },
  
  // Tepung Tapioka generic eceran
  { name: 'Tepung Tapioka 1kg', category: 'Sembako', basePrice: 10000, sellingPrice: 12000, stock: 40 },
  { name: 'Tepung Tapioka 1/2kg', category: 'Sembako', basePrice: 5000, sellingPrice: 6000, stock: 60 },
  { name: 'Tepung Tapioka 1/4kg', category: 'Sembako', basePrice: 2500, sellingPrice: 3000, stock: 80 },
  { name: 'Gula Pasir Curah 1kg', category: 'Sembako', basePrice: 15000, sellingPrice: 17000, stock: 60 },
  { name: 'Gula Pasir Curah 1/2kg', category: 'Sembako', basePrice: 7500, sellingPrice: 8500, stock: 80 },
  { name: 'Gula Pasir Curah 1/4kg', category: 'Sembako', basePrice: 3750, sellingPrice: 4250, stock: 100 },
  { name: 'Minyak Goreng Curah 1/2kg', category: 'Sembako', basePrice: 7000, sellingPrice: 8000, stock: 40 },
  { name: 'Minyak Goreng Curah 1/4kg', category: 'Sembako', basePrice: 3500, sellingPrice: 4000, stock: 60 },
  { name: 'Garam Halus 1kg', category: 'Sembako', basePrice: 8000, sellingPrice: 10000, stock: 30 },
  { name: 'Garam Halus 1/2kg', category: 'Sembako', basePrice: 4000, sellingPrice: 5000, stock: 50 },
  { name: 'Garam Halus 1/4kg', category: 'Sembako', basePrice: 2000, sellingPrice: 2500, stock: 80 },
  
  // Penambahan produk populer lainnya
  { name: 'Ultra Milk UHT Coklat 250ml', category: 'Minuman', basePrice: 6000, sellingPrice: 7500, stock: 24 },
  { name: 'Indomilk UHT Stroberi 250ml', category: 'Minuman', basePrice: 6000, sellingPrice: 7500, stock: 24 },
  { name: 'Sprite 390ml', category: 'Minuman', basePrice: 4000, sellingPrice: 5000, stock: 24 },
  { name: 'Fanta 390ml', category: 'Minuman', basePrice: 4000, sellingPrice: 5000, stock: 24 },
  { name: 'Royco Ayam Sachet', category: 'Bumbu Dapur', basePrice: 500, sellingPrice: 1000, stock: 100 },
  { name: 'Sasa Tepung Bumbu 80g', category: 'Bumbu Dapur', basePrice: 3500, sellingPrice: 4500, stock: 20 },
  { name: 'Bumbu Racik Nasi Goreng', category: 'Bumbu Dapur', basePrice: 2500, sellingPrice: 3500, stock: 30 },
  { name: 'Pepsodent Herbal 190g', category: 'Perlengkapan', basePrice: 12000, sellingPrice: 14000, stock: 12 },
  { name: 'Rinso Cair 450ml', category: 'Perlengkapan', basePrice: 18000, sellingPrice: 21000, stock: 12 },
  { name: 'Baygon Aerosol 225ml', category: 'Perlengkapan', basePrice: 22000, sellingPrice: 25000, stock: 8 },
  { name: 'SilverQueen Chunky Bar', category: 'Snack', basePrice: 16000, sellingPrice: 18000, stock: 10 },
  { name: 'Tic Tac Snack', category: 'Snack', basePrice: 3000, sellingPrice: 4000, stock: 20 },
  { name: 'Qtela Singkong 68g', category: 'Snack', basePrice: 7000, sellingPrice: 8500, stock: 20 },
  { name: 'Marlboro Filter 20', category: 'Rokok', basePrice: 35000, sellingPrice: 38000, stock: 30 },
  { name: 'Aqua Galon Kosong', category: 'Gas & Galon', basePrice: 55000, sellingPrice: 60000, stock: 5 },
  { name: 'Antangin JRG Sachet', category: 'Obat', basePrice: 3000, sellingPrice: 4000, stock: 30 },
  { name: 'Komix OB Sachet', category: 'Obat', basePrice: 3000, sellingPrice: 4000, stock: 30 },
  
  // Warung kelontong umum
  { name: 'Susu Kental Manis FF Sachet', category: 'Makanan Instan', basePrice: 3000, sellingPrice: 4000, stock: 40 },
  { name: 'BonCabe Level 10 4.5g', category: 'Bumbu Dapur', basePrice: 2500, sellingPrice: 3500, stock: 30 },
  { name: 'Korek Api Gas', category: 'Perlengkapan', basePrice: 4000, sellingPrice: 5000, stock: 20 },
  { name: 'Korek Api Kayu (Kotak)', category: 'Perlengkapan', basePrice: 2000, sellingPrice: 3000, stock: 40 },
  { name: 'Lilin 1 batang', category: 'Perlengkapan', basePrice: 1500, sellingPrice: 2000, stock: 50 },
  { name: 'Baterai AA Alkaline (2pcs)', category: 'Perlengkapan', basePrice: 8000, sellingPrice: 10000, stock: 20 },
  { name: 'Baterai AAA Alkaline (2pcs)', category: 'Perlengkapan', basePrice: 8000, sellingPrice: 10000, stock: 20 },
  { name: 'Plester Hansaplast (10 pcs)', category: 'Perlengkapan', basePrice: 7000, sellingPrice: 9000, stock: 15 },
  { name: 'Tisu Paseo Pocket', category: 'Perlengkapan', basePrice: 3000, sellingPrice: 4000, stock: 30 },
  { name: 'Tissue Toilet Roll', category: 'Perlengkapan', basePrice: 6000, sellingPrice: 8000, stock: 20 },
  { name: 'Balsam Geliga 20g', category: 'Obat', basePrice: 10000, sellingPrice: 12000, stock: 10 }
];
