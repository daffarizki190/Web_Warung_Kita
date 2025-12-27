import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/store';
import { LayoutDashboard, ShoppingCart, Package, BookOpen, Settings, LogOut, Menu, X } from 'lucide-react';
import clsx from 'clsx';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, profile } = useStore();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ShoppingCart, label: 'Kasir', path: '/pos' },
    { icon: Package, label: 'Stok Barang', path: '/inventory' },
    { icon: BookOpen, label: 'Buku Hutang', path: '/debt' },
    { icon: Settings, label: 'Profil Warung', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h1 className="text-xl font-bold text-slate-800">{profile.name}</h1>
            <p className="text-sm text-slate-500">Point of Sales</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={clsx("w-5 h-5", isActive ? "text-white" : "text-slate-500")} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-slate-800">{profile.name}</span>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>

        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
