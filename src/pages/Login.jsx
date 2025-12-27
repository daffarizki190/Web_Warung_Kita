import React, { useState, useEffect } from 'react';
import { useStore } from '../context/store';
import { Store, User as UserIcon, Lock, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const last = localStorage.getItem('wd_last_username');
    if (last) setUsername(last);
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);
  const { login } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(username, password);
    if (!success) {
      setError('Invalid username or password');
    } else {
      try { localStorage.setItem('wd_last_username', username); } catch {}
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-400 to-purple-600 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
      `}</style>
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" style={{ animation: 'floatY 7s ease-in-out infinite' }} />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" style={{ animation: 'floatX 8s ease-in-out infinite' }} />

      <div className={`w-full max-w-md z-10 flex flex-col items-center text-center transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
        {/* Illustration Circle */}
        <div className="bg-white p-8 rounded-full shadow-2xl mb-8 w-48 h-48 flex items-center justify-center transition-all duration-500">
          <Store className="w-24 h-24 text-amber-500" style={{ animation: 'floatY 5s ease-in-out infinite' }} />
        </div>

        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-sm">WARUNG KITA</h1>
        <p className="text-white/90 mb-12 text-lg">Kelola warung jadi lebih mudah</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 transition-all duration-500">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full pl-12 pr-6 py-4 bg-white/90 border-none rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-300/50 shadow-sm transition-all disabled:opacity-70"
              placeholder="Username"
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full pl-12 pr-12 py-4 bg-white/90 border-none rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-amber-300/50 shadow-sm transition-all disabled:opacity-70"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-500/80 rounded-xl text-white text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-white text-purple-700 font-bold text-lg rounded-2xl shadow-xl hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-4 disabled:opacity-70 disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full border-2 border-purple-700 border-t-transparent animate-spin"></span>
                Memproses...
              </span>
            ) : (
              'Masuk'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
