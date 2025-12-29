import React, { useState, useEffect } from 'react';
import StoreContext from './store';
import { products as seedProducts } from '../../server/seedData.js';

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
  const STATIC = !import.meta.env.VITE_API_URL;
  const readJSON = (key, fallback) => {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  };
  const apiFetch = async (path, options = {}) => {
    if (STATIC) throw new Error('static_mode');
    const token = localStorage.getItem('wd_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
    const controller = new AbortController();
    const timeoutMs = options.timeoutMs && Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : 0;
    let timer = null;
    if (timeoutMs) {
      timer = setTimeout(() => controller.abort(), timeoutMs);
    }
    const res = await fetch(`${API_HOST}/api${path}`, { ...options, headers, signal: controller.signal });
    if (timer) clearTimeout(timer);
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
  const [user, setUser] = useState(() => readJSON('wd_user', null));

  const [products, setProducts] = useState(() => readJSON('wd_products', []));

  const [transactions, setTransactions] = useState(() => readJSON('wd_transactions', []));

  const [debts, setDebts] = useState(() => readJSON('wd_debts', []));

  const [debtHistory, setDebtHistory] = useState(() => readJSON('wd_debt_history', []));

  const [profile, setProfile] = useState(() => readJSON('wd_profile', INITIAL_PROFILE));
  
  const [usersList, setUsersList] = useState(() => {
    const base = readJSON('wd_users', INITIAL_USERS);
    const existing = new Set(base.map(u => u.username));
    const toAdd = SEED_USERS
      .filter(u => !existing.has(u.username))
      .map(u => ({ id: Date.now().toString() + '_' + u.username.toLowerCase(), ...u }));
    return [...base, ...toAdd];
  });
  const [serverUsers, setServerUsers] = useState([]);

  // --- PERSISTENCE ---
  useEffect(() => {
    try { localStorage.setItem('wd_products', JSON.stringify(products)); } catch {}
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
    try { localStorage.setItem('wd_debts', JSON.stringify(debts)); } catch {}
  }, [debts]);

  useEffect(() => {
    try { localStorage.setItem('wd_debt_history', JSON.stringify(debtHistory)); } catch {}
  }, [debtHistory]);

  useEffect(() => {
    try { localStorage.setItem('wd_profile', JSON.stringify(profile)); } catch {}
  }, [profile]);

  useEffect(() => {
    try { localStorage.setItem('wd_users', JSON.stringify(usersList)); } catch {}
  }, [usersList]);

  useEffect(() => {
    const token = localStorage.getItem('wd_token');
    if (STATIC || !token) return;
    (async () => {
      const debtsP = apiFetch('/debts', { timeoutMs: 3000 });
      const transP = apiFetch('/transactions', { timeoutMs: 3000 });
      const productsP = apiFetch('/products', { timeoutMs: 5000 });
      const profileP = apiFetch('/profile', { timeoutMs: 3000 });
      const usersP = apiFetch('/users', { timeoutMs: 3000 });
      const [debtsRes, transRes, productsRes, profRes, usersRes] = await Promise.allSettled([
        debtsP, transP, productsP, profileP, usersP
      ]);
      if (debtsRes.status === 'fulfilled') {
        const mappedDebts = debtsRes.value.map(d => ({
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
      }
      if (transRes.status === 'fulfilled') {
        const mappedTrans = transRes.value.map(t => ({
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
      }
      if (productsRes.status === 'fulfilled') {
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
        for (const p of productsRes.value) {
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
      }
      if (profRes.status === 'fulfilled' && profRes.value) {
        setProfile({ name: profRes.value.name, address: profRes.value.address, whatsapp: profRes.value.whatsapp });
      }
      if (usersRes.status === 'fulfilled') {
        setServerUsers(usersRes.value);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!STATIC) return;
    if (products && products.length > 0) return;
    const seen = new Set();
    const out = [];
    for (const p of seedProducts) {
      const name = (p.name || '').trim();
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const slug = key.replace(/\s+/g, '-').replace(/\//g, '-');
      out.push({
        id: `${slug}_${out.length + 1}`,
        name,
        category: p.category,
        basePrice: Number(p.basePrice) || 0,
        sellingPrice: Number(p.sellingPrice) || 0,
        stock: Number(p.stock) || 0,
        image: '',
        createdBy: 'Seed',
        createdAt: new Date().toISOString()
      });
    }
    setProducts(out);
  }, []);

  // --- ACTIONS ---

  const login = async (username, password) => {
    try {
      if (!STATIC) {
        const res = await apiFetch('/login', { method: 'POST', body: JSON.stringify({ username, password }) });
        localStorage.setItem('wd_token', res.token);
        localStorage.setItem('wd_user', JSON.stringify(res.user));
        setUser(res.user);
        return true;
      }
      throw new Error('static_mode');
    } catch {
      try { localStorage.removeItem('wd_token'); } catch {}
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
    try { localStorage.removeItem('wd_token'); } catch {}
    try { localStorage.removeItem('wd_user'); } catch {}
    setUser(null);
  };

  const addProduct = async (product) => {
    const newProduct = { 
      ...product, 
      id: Date.now().toString(),
      image: '',
      createdBy: user?.username || 'Unknown',
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
    return true;
  };

  const updateProduct = async (id, updatedProduct) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const image = '';
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
    setProducts(prev => prev.map(p => ({ ...p, image: '' })));
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
      clearDebtsWithPassword,
      getExportData: () => JSON.stringify({
        profile,
        products,
        transactions,
        debts,
        debtHistory,
        usersList
      }, null, 2),
      importData: (obj) => {
        try {
          if (obj.profile) setProfile(obj.profile);
          if (Array.isArray(obj.products)) {
            const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
            const slugify = (s) => (s || '').toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[\\/]+/g, '-').replace(/[^a-z0-9_-]/g, '');
            const seen = new Set();
            const sanitized = [];
            for (const p of obj.products) {
              let id = (p.id || '').toString().trim();
              if (!id) id = genId() + '_' + slugify(p.name);
              id = id.replace(/[\\/]+/g, '-');
              if (seen.has(id)) id = genId() + '_' + slugify(p.name);
              seen.add(id);
              const sellingPrice = Number(p.sellingPrice) || 0;
              const basePrice = Number(p.basePrice) || 0;
              const stock = Number(p.stock) || 0;
              sanitized.push({ ...p, id, image: '', sellingPrice, basePrice, stock });
            }
            setProducts(sanitized);
          }
          if (Array.isArray(obj.transactions)) setTransactions(obj.transactions);
          if (Array.isArray(obj.debts)) setDebts(obj.debts);
          if (Array.isArray(obj.debtHistory)) setDebtHistory(obj.debtHistory);
          if (Array.isArray(obj.usersList)) setUsersList(obj.usersList);
          return true;
        } catch {
          return false;
        }
      }
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
