import React, { useState, useMemo } from 'react';
import { useStore } from '../context/store';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, User } from 'lucide-react';
import Modal from '../components/Modal';

const POS = () => {
  const { products, addTransaction } = useStore();
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'debt'
  const [customerName, setCustomerName] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.sellingPrice * item.qty), 0);
  const change = (Number(amountPaid) || 0) - totalAmount;

  const handlePayment = () => {
    if (cart.length === 0) return;

    const transaction = {
      items: cart,
      total: totalAmount,
      amountPaid: Number(amountPaid) || 0,
      change: change,
      paymentMethod,
      customerName: paymentMethod === 'debt' ? customerName : 'Umum',
    };

    addTransaction(transaction);
    setCart([]);
    setAmountPaid('');
    setCustomerName('');
    setIsPaymentModalOpen(false);
    // Could show a success toast here
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              autoFocus
              placeholder="Cari produk untuk ditambahkan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-8 text-slate-500">
                Produk tidak ditemukan
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Keranjang
          </h3>
          <span className="bg-white/20 px-2 py-1 rounded-lg text-sm font-medium">
            {cart.reduce((sum, item) => sum + item.qty, 0)} items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
              <p>Keranjang kosong</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="font-medium text-slate-800 truncate">{item.name}</div>
                  <div className="text-xs text-indigo-600 font-bold">
                    Rp {(item.sellingPrice * item.qty).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
                  <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-slate-100 rounded">
                    <Minus className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-slate-100 rounded">
                    <Plus className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-500">Total Tagihan</span>
            <span className="text-2xl font-bold text-slate-800">
              Rp {totalAmount.toLocaleString()}
            </span>
          </div>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            disabled={cart.length === 0}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex justify-center items-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Bayar Sekarang
          </button>
        </div>
      </div>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Pembayaran"
      >
        <div className="space-y-6">
          <div className="text-center p-4 bg-slate-50 rounded-xl">
            <p className="text-slate-500 text-sm mb-1">Total Tagihan</p>
            <p className="text-3xl font-bold text-slate-800">Rp {totalAmount.toLocaleString()}</p>
          </div>

          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                paymentMethod === 'cash' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Tunai (Cash)
            </button>
            <button
              onClick={() => setPaymentMethod('debt')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                paymentMethod === 'debt' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Hutang (Bon)
            </button>
          </div>

          {paymentMethod === 'debt' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama Pelanggan</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Masukkan nama pelanggan"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {paymentMethod === 'cash' ? 'Uang Diterima' : 'Uang Muka (Opsional)'}
            </label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-lg font-medium"
            />
          </div>

          <div className="bg-indigo-50 p-4 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-indigo-800 font-medium">
                {change >= 0 ? 'Kembalian' : 'Kurang'}
              </span>
              <span className={`text-2xl font-bold ${change >= 0 ? 'text-indigo-600' : 'text-red-500'}`}>
                Rp {Math.abs(change).toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={paymentMethod === 'debt' && !customerName}
            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-all"
          >
            Selesaikan Transaksi
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default POS;
  const ProductCard = ({ product, onAdd }) => (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-bold text-slate-800 truncate mr-2">{product.name}</h4>
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium whitespace-nowrap">
            {product.category}
          </span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400">Harga</p>
            <p className="font-bold text-indigo-600">Rp {product.sellingPrice.toLocaleString()}</p>
          </div>
        </div>
        <button
          onClick={() => onAdd(product)}
          className="mt-3 w-full py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
