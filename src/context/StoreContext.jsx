import React, { useState, useEffect } from 'react';
import StoreContext from './store';

export const StoreProvider = ({ children }) => {
  const API_HOST = (() => {
    // If VITE_API_URL is set (e.g. in Vercel environment variables), use it.
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    // Development fallback
    if (import.meta.env.DEV) {
       return 'http://localhost:5000';
    }
    // If no VITE_API_URL and not DEV, assume same domain (relative path)
    return '';
  })();
  const apiFetch = async (path, options = {}) => {
    const token = localStorage.getItem('wd_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const res = await fetch(`${API_HOST}/api${path}`, { ...options, headers });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };
  const INITIAL_PROFILE = {
    name: 'WARUNG KITA',
    address: 'Jalan Cililitan Besar NO. 28',
    whatsapp: '085156566218'
  };

  const INITIAL_USERS = [
    { id: '1', username: 'admin', password: 'password', role: 'admin' },
    { id: '2', username: 'kasir', password: 'password', role: 'cashier' }
  ];

  const SEED_USERS = [
    { username: 'Mamah', password: 'mamah123', role: 'cashier' },
    { username: 'Bapak', password: 'bapak123', role: 'cashier' },
    { username: 'Diva', password: 'diva123', role: 'cashier' },
    { username: 'Daffa', password: 'daffa123', role: 'cashier' },
    { username: 'Faris', password: 'faris123', role: 'cashier' },
  ];

  // --- STATE ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('wd_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('wd_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('wd_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [debts, setDebts] = useState(() => {
    const saved = localStorage.getItem('wd_debts');
    return saved ? JSON.parse(saved) : [];
  });

  const [debtHistory, setDebtHistory] = useState(() => {
    const saved = localStorage.getItem('wd_debt_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('wd_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });
  
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('wd_users');
    const base = saved ? JSON.parse(saved) : INITIAL_USERS;
    const existing = new Set(base.map(u => u.username));
    const toAdd = SEED_USERS
      .filter(u => !existing.has(u.username))
      .map(u => ({ id: Date.now().toString() + '_' + u.username.toLowerCase(), ...u }));
    return [...base, ...toAdd];
  });
  const [serverUsers, setServerUsers] = useState([]);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('wd_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const MAX = 500;
    const data = transactions.length > MAX ? transactions.slice(0, MAX) : transactions;
    try {
      localStorage.setItem('wd_transactions', JSON.stringify(data));
    } catch (e) {
      let size = Math.min(data.length, MAX);
      let ok = false;
      while (size > 0 && !ok) {
        try {
          localStorage.setItem('wd_transactions', JSON.stringify(data.slice(0, size)));
          ok = true;
        } catch (_) {
          size = Math.floor(size * 0.7);
        }
      }
    }
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('wd_debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('wd_debt_history', JSON.stringify(debtHistory));
  }, [debtHistory]);

  useEffect(() => {
    localStorage.setItem('wd_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('wd_users', JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    const token = localStorage.getItem('wd_token');
    if (!token) return;
    (async () => {
      try {
        const debtsRes = await apiFetch('/debts');
        const mappedDebts = debtsRes.map(d => ({
          id: d.id,
          transactionId: d.transaction_id,
          customerName: d.customer_name,
          amount: Number(d.amount) || 0,
          date: d.created_at,
          is_paid: !!d.is_paid,
          verify_pending: false,
          paidRequestedAt: null,
          paidAt: d.paid_at || null,
          verifiedBy: null,
          items: [],
          createdBy: d.user_name || 'Unknown',
          notes: ''
        }));
        setDebts(mappedDebts);
      } catch {}
      try {
        const transRes = await apiFetch('/transactions');
        const mappedTrans = transRes.map(t => ({
          id: t.id,
          date: t.created_at,
          items: (t.items || []).map(it => ({ id: it.product_id, name: it.name || '', qty: Number(it.qty) || 0, sellingPrice: Number(it.price_at_sale) || 0 })),
          total: Number(t.total) || 0,
          amountPaid: Number(t.amount_paid) || 0,
          change: Number(t.change_amount) || 0,
          paymentMethod: t.payment_method,
          customerName: t.customer_name,
          createdBy: t.user_name || 'Unknown'
        }));
        setTransactions(mappedTrans);
      } catch {}
      try {
        const productsRes = await apiFetch('/products');
        const normalizeCommodity = (name) => {
          const lower = (name || '').toLowerCase();
          const size = lower.includes('1/2kg') ? '1/2kg' : lower.includes('1/4kg') ? '1/4kg' : lower.includes('1kg') ? '1kg' : null;
          if (!size) return null;
          if (lower.includes('beras')) return `Beras ${size}`;
          if (lower.includes('gula')) return `Gula ${size}`;
          if (lower.includes('minyak')) return `Minyak Goreng ${size}`;
          if (lower.includes('terigu')) return `Tepung Terigu ${size}`;
          if (lower.includes('tapioka')) return `Tepung Tapioka ${size}`;
          return null;
        };
        const temp = [];
        for (const p of productsRes) {
          const normalized = normalizeCommodity(p.name);
          const base = {
            id: p.id,
            name: normalized || p.name,
            category: p.category,
            basePrice: Number(p.base_price) || 0,
            sellingPrice: Number(p.selling_price) || 0,
            stock: Number(p.stock) || 0,
            image: ''
          };
          temp.push(base);
        }
        const grouped = new Map();
        const others = [];
        for (const item of temp) {
          const isGeneric = (
            item.name === 'Beras 1kg' || item.name === 'Beras 1/2kg' || item.name === 'Beras 1/4kg' ||
            item.name === 'Gula 1kg' || item.name === 'Gula 1/2kg' || item.name === 'Gula 1/4kg' ||
            item.name === 'Minyak Goreng 1kg' || item.name === 'Minyak Goreng 1/2kg' || item.name === 'Minyak Goreng 1/4kg' ||
            item.name === 'Tepung Terigu 1kg' || item.name === 'Tepung Terigu 1/2kg' || item.name === 'Tepung Terigu 1/4kg' ||
            item.name === 'Tepung Tapioka 1kg' || item.name === 'Tepung Tapioka 1/2kg' || item.name === 'Tepung Tapioka 1/4kg'
          );
          if (isGeneric) {
            const key = item.name;
            if (!grouped.has(key)) {
              grouped.set(key, item);
            } else {
              const prev = grouped.get(key);
              grouped.set(key, item.sellingPrice >= prev.sellingPrice ? item : prev);
            }
          } else {
            others.push(item);
          }
        }
        setProducts([...grouped.values(), ...others]);
      } catch {}
      try {
        const profRes = await apiFetch('/profile');
        if (profRes) setProfile({ name: profRes.name, address: profRes.address, whatsapp: profRes.whatsapp });
      } catch {}
      try {
        const usersRes = await apiFetch('/users');
        setServerUsers(usersRes);
      } catch {}
    })();
  }, [user]);

  // --- ACTIONS ---

  const login = async (username, password) => {
    try {
      const res = await apiFetch('/login', { method: 'POST', body: JSON.stringify({ username, password }) });
      localStorage.setItem('wd_token', res.token);
      localStorage.setItem('wd_user', JSON.stringify(res.user));
      setUser(res.user);
      try {
        const productsRes = await apiFetch('/products');
        const normalizeCommodity = (name) => {
          const lower = (name || '').toLowerCase();
          const size = lower.includes('1/2kg') ? '1/2kg' : lower.includes('1/4kg') ? '1/4kg' : lower.includes('1kg') ? '1kg' : null;
          if (!size) return null;
          if (lower.includes('beras')) return `Beras ${size}`;
          if (lower.includes('gula')) return `Gula ${size}`;
          if (lower.includes('minyak')) return `Minyak Goreng ${size}`;
          if (lower.includes('terigu')) return `Tepung Terigu ${size}`;
          if (lower.includes('tapioka')) return `Tepung Tapioka ${size}`;
          return null;
        };
        const temp = [];
        for (const p of productsRes) {
          const normalized = normalizeCommodity(p.name);
          const base = {
            id: p.id,
            name: normalized || p.name,
            category: p.category,
            basePrice: Number(p.base_price) || 0,
            sellingPrice: Number(p.selling_price) || 0,
            stock: Number(p.stock) || 0,
            image: ''
          };
          temp.push(base);
        }
        const grouped = new Map();
        const others = [];
        for (const item of temp) {
          const isGeneric = (
            item.name === 'Beras 1kg' || item.name === 'Beras 1/2kg' || item.name === 'Beras 1/4kg' ||
            item.name === 'Gula 1kg' || item.name === 'Gula 1/2kg' || item.name === 'Gula 1/4kg' ||
            item.name === 'Minyak Goreng 1kg' || item.name === 'Minyak Goreng 1/2kg' || item.name === 'Minyak Goreng 1/4kg' ||
            item.name === 'Tepung Terigu 1kg' || item.name === 'Tepung Terigu 1/2kg' || item.name === 'Tepung Terigu 1/4kg' ||
            item.name === 'Tepung Tapioka 1kg' || item.name === 'Tepung Tapioka 1/2kg' || item.name === 'Tepung Tapioka 1/4kg'
          );
          if (isGeneric) {
            const key = item.name;
            if (!grouped.has(key)) {
              grouped.set(key, item);
            } else {
              const prev = grouped.get(key);
              grouped.set(key, item.sellingPrice >= prev.sellingPrice ? item : prev);
            }
          } else {
            others.push(item);
          }
        }
        setProducts([...grouped.values(), ...others]);
        const usersRes = await apiFetch('/users');
        setServerUsers(usersRes);
      } catch {}
      return true;
    } catch {
      const local = usersList.find(u => u.username === username && u.password === password);
      if (local) {
        const u = { id: local.id, username: local.username, role: local.role };
        localStorage.setItem('wd_user', JSON.stringify(u));
        setUser(u);
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('wd_user');
    setUser(null);
  };

  const addProduct = async (product) => {
    const autoImage = autoImageFor(product.name, product.category);
    const newProduct = { 
      ...product, 
      id: Date.now().toString(),
      image: product.image && product.image.trim() ? product.image.trim() : autoImage,
      createdBy: user?.username || 'Unknown',
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
    return true;
  };

  const updateProduct = async (id, updatedProduct) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const image = updatedProduct.image !== undefined && updatedProduct.image !== ''
        ? updatedProduct.image
        : p.image || autoImageFor(p.name, p.category);
      return { ...p, ...updatedProduct, image, updatedBy: user?.username || 'Unknown', updatedAt: new Date().toISOString() };
    }));
    return true;
  };

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    return true;
  };

  const addTransaction = async (transaction) => {
    try {
      await apiFetch('/transactions', {
        method: 'POST',
        body: JSON.stringify({
          items: (transaction.items || []).map(it => ({ id: it.id, qty: Number(it.qty) || 0, sellingPrice: Number(it.sellingPrice) || 0 })),
          total: Number(transaction.total) || 0,
          amountPaid: Number(transaction.amountPaid) || 0,
          change: Number(transaction.change) || 0,
          paymentMethod: transaction.paymentMethod,
          customerName: transaction.customerName || 'Umum'
        })
      });
      const transRes = await apiFetch('/transactions');
      const mappedTrans = transRes.map(t => ({
        id: t.id,
        date: t.created_at,
        items: (t.items || []).map(it => ({ id: it.product_id, name: it.name || '', qty: Number(it.qty) || 0, sellingPrice: Number(it.price_at_sale) || 0 })),
        total: Number(t.total) || 0,
        amountPaid: Number(t.amount_paid) || 0,
        change: Number(t.change_amount) || 0,
        paymentMethod: t.payment_method,
        customerName: t.customer_name,
        createdBy: t.user_name || 'Unknown'
      }));
      setTransactions(mappedTrans);
      const debtsRes = await apiFetch('/debts');
      const mappedDebts = debtsRes.map(d => ({
        id: d.id,
        transactionId: d.transaction_id,
        customerName: d.customer_name,
        amount: Number(d.amount) || 0,
        date: d.created_at,
        is_paid: !!d.is_paid,
        verify_pending: false,
        paidRequestedAt: null,
        paidAt: d.paid_at || null,
        verifiedBy: null,
        items: [],
        createdBy: d.user_name || 'Unknown',
        notes: ''
      }));
      setDebts(mappedDebts);
      const hist = { id: Date.now().toString() + '_hist', type: transaction.paymentMethod === 'debt' ? 'ADD_FROM_POS' : 'ADD_FROM_POS', ts: new Date().toISOString(), by: user?.username || 'Unknown', refId: null, customerName: transaction.customerName || 'Umum', amount: Number(transaction.total) || 0 };
      setDebtHistory(prev => [hist, ...prev]);
      return true;
    } catch {
      const newTrans = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        items: (transaction.items || []).map(it => ({ id: it.id, name: it.name || '', qty: Number(it.qty) || 0, sellingPrice: Number(it.sellingPrice) || 0 })),
        total: Number(transaction.total) || 0,
        amountPaid: Number(transaction.amountPaid) || 0,
        change: Number(transaction.change) || 0,
        paymentMethod: transaction.paymentMethod,
        customerName: transaction.customerName || 'Umum',
        createdBy: user?.username || 'Unknown'
      };
      setTransactions(prev => [newTrans, ...prev]);
      if (transaction.paymentMethod === 'debt') {
        const newDebt = {
          id: Date.now().toString() + '_debt',
          transactionId: newTrans.id,
          customerName: transaction.customerName || 'Umum',
          amount: Number(transaction.total) || 0,
          date: new Date().toISOString(),
          is_paid: false,
          verify_pending: false,
          paidRequestedAt: null,
          paidAt: null,
          verifiedBy: null,
          items: [],
          createdBy: user?.username || 'Unknown',
          notes: ''
        };
        setDebts(prev => [newDebt, ...prev]);
      }
      const hist = { id: Date.now().toString() + '_hist', type: 'ADD_FROM_POS', ts: new Date().toISOString(), by: user?.username || 'Unknown', refId: null, customerName: transaction.customerName || 'Umum', amount: Number(transaction.total) || 0 };
      setDebtHistory(prev => [hist, ...prev]);
      return true;
    }
  };

  const addDebt = async (debtData) => {
    const newDebt = {
      id: Date.now().toString() + '_manual_debt',
      transactionId: null,
      customerName: debtData.customerName,
      amount: Number(debtData.amount),
      date: new Date().toISOString(),
      is_paid: false,
      verify_pending: false,
      paidRequestedAt: null,
      paidAt: null,
      verifiedBy: null,
      items: [],
      createdBy: user?.username || 'Unknown',
      notes: debtData.notes
    };
    setDebts(prev => [newDebt, ...prev]);
    const hist = { id: Date.now().toString() + '_hist', type: 'ADD_MANUAL', ts: new Date().toISOString(), by: user?.username || 'Unknown', refId: newDebt.id, customerName: newDebt.customerName, amount: Number(newDebt.amount) || 0 };
    setDebtHistory(prev => [hist, ...prev]);
    return true;
  };

  const requestDebtPaid = async (id) => {
    setDebts(prev => prev.map(d => d.id === id ? { ...d, verify_pending: true, paidRequestedAt: new Date().toISOString(), requestedBy: user?.username || 'Unknown' } : d));
    const target = debts.find(d => d.id === id);
    const hist = { id: Date.now().toString() + '_hist', type: 'REQUEST_VERIFY', ts: new Date().toISOString(), by: user?.username || 'Unknown', refId: id, customerName: target?.customerName, amount: Number(target?.amount) || 0 };
    setDebtHistory(prev => [hist, ...prev]);
    return true;
  };

  const verifyDebtPaid = async (id) => {
    try {
      await apiFetch(`/debts/${id}/pay`, { method: 'PUT' });
      const debtsRes = await apiFetch('/debts');
      const mappedDebts = debtsRes.map(d => ({
        id: d.id,
        transactionId: d.transaction_id,
        customerName: d.customer_name,
        amount: Number(d.amount) || 0,
        date: d.created_at,
        is_paid: !!d.is_paid,
        verify_pending: false,
        paidRequestedAt: null,
        paidAt: d.paid_at || null,
        verifiedBy: user?.username || 'Unknown',
        items: [],
        createdBy: d.user_name || 'Unknown',
        notes: ''
      }));
      setDebts(mappedDebts);
      const target = mappedDebts.find(d => d.id === id);
      const hist = { id: Date.now().toString() + '_hist', type: 'VERIFY_PAID', ts: new Date().toISOString(), by: user?.username || 'Unknown', refId: id, customerName: target?.customerName, amount: Number(target?.amount) || 0 };
      setDebtHistory(prev => [hist, ...prev]);
      return true;
    } catch {
      setDebts(prev => prev.map(d => d.id === id ? { ...d, is_paid: true, verify_pending: false, paidAt: new Date().toISOString(), verifiedBy: user?.username || 'Unknown' } : d));
      const target = debts.find(d => d.id === id);
      const hist = { id: Date.now().toString() + '_hist', type: 'VERIFY_PAID', ts: new Date().toISOString(), by: user?.username || 'Unknown', refId: id, customerName: target?.customerName, amount: Number(target?.amount) || 0 };
      setDebtHistory(prev => [hist, ...prev]);
      return true;
    }
  };

  const markDebtPaid = async (id) => verifyDebtPaid(id);

  const updateProfile = async (newProfile) => {
    const token = localStorage.getItem('wd_token');
    if (token) {
      try {
        const res = await apiFetch('/profile', { method: 'PUT', body: JSON.stringify({ name: newProfile.name, address: newProfile.address, whatsapp: newProfile.whatsapp }) });
        setProfile({ name: res.name, address: res.address, whatsapp: res.whatsapp, updatedBy: user?.username || 'Unknown', updatedAt: new Date().toISOString() });
        return true;
      } catch {}
    }
    setProfile({ ...newProfile, updatedBy: user?.username || 'Unknown', updatedAt: new Date().toISOString() });
    return true;
  };

  const updatePassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem('wd_token');
    if (token) {
      try {
        await apiFetch('/account/password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) });
        return true;
      } catch {}
    }
    const currentUserInList = usersList.find(u => u.username === user.username);
    if (currentUserInList && currentUserInList.password === currentPassword) {
      setUsersList(prev => prev.map(u => 
        u.username === user.username ? { ...u, password: newPassword } : u
      ));
      return true;
    }
    return false;
  };

  const clearDebtsWithPassword = async (password, reason) => {
    const currentUserInList = usersList.find(u => u.username === user?.username);
    if (!currentUserInList || currentUserInList.password !== password) return false;
    if (!reason || !reason.trim()) return false;
    const count = debts.length;
    const total = debts.reduce((s, d) => s + (Number(d.amount) || 0), 0);
    setDebts([]);
    const hist = { id: Date.now().toString() + '_hist', type: 'CLEAR_ALL', ts: new Date().toISOString(), by: user?.username || 'Unknown', clearedCount: count, clearedTotal: total, reason: reason.trim() };
    setDebtHistory(prev => [hist, ...prev]);
    return true;
  };

  // User Management
  const registerUser = async (username, password, role) => {
    try {
      await apiFetch('/register', { method: 'POST', body: JSON.stringify({ username, password, role }) });
      const usersRes = await apiFetch('/users');
      setServerUsers(usersRes);
      return true;
    } catch {
      const newUser = {
        id: Date.now().toString(),
        username,
        password,
        role: role || 'cashier',
        createdBy: user?.username || 'Unknown',
        createdAt: new Date().toISOString()
      };
      setUsersList(prev => [...prev, newUser]);
      return true;
    }
  };

  const deleteUser = async (id) => {
    try {
      await apiFetch(`/users/${id}`, { method: 'DELETE' });
      const usersRes = await apiFetch('/users');
      setServerUsers(usersRes);
      return true;
    } catch {
      setUsersList(prev => prev.filter(u => u.id !== id));
      return true;
    }
  };

  // Migrate old Unsplash image URLs to Picsum once on mount
  useEffect(() => {
    setProducts(prev => prev.map(p => {
      if (p.image && p.image.includes('source.unsplash.com')) {
        const seed = encodeURIComponent((p.name || 'produk').trim().replace(/\s+/g, '-'));
        return { ...p, image: `https://picsum.photos/seed/${seed}/400/300` };
      }
      return p;
    }));
  }, []);

  return (
    <StoreContext.Provider value={{
      user,
      products,
      transactions,
      debts,
      debtHistory,
      profile,
      usersList,
      serverUsers,
      login,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      addTransaction,
      addDebt,
      requestDebtPaid,
      verifyDebtPaid,
      markDebtPaid,
      updateProfile,
      updatePassword,
      registerUser,
      deleteUser,
      clearDebtsWithPassword
    }}>
      {children}
    </StoreContext.Provider>
  );
};
  const autoImageFor = (name, category) => {
    const n = (name || '').toLowerCase();
    if (n.includes('mie')) return 'https://loremflickr.com/400/300/noodles,food';
    if (n.includes('kopi')) return 'https://loremflickr.com/400/300/coffee,drink';
    if (n.includes('teh')) return 'https://loremflickr.com/400/300/tea,drink';
    if (n.includes('susu')) return 'https://loremflickr.com/400/300/milk,drink';
    if (n.includes('gula')) return 'https://loremflickr.com/400/300/sugar';
    if (n.includes('minyak')) return 'https://loremflickr.com/400/300/oil,food';
    const tag = category === 'Makanan' ? 'food' :
      category === 'Minuman' ? 'drink' :
      category === 'Sembako' ? 'grocery,food' :
      category === 'Peralatan Rumah Tangga' ? 'household,home' : 'product,shopping';
    return `https://loremflickr.com/400/300/${tag}`;
  };
