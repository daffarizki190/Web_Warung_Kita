import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, BookOpen, Settings } from 'lucide-react';

const DashboardCard = ({ to, icon, title, description, color }) => (
  <Link 
    to={to}
    className="group relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col items-center justify-center text-center gap-4 h-64"
  >
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-${color}-500`} />
    <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <div>
      <h3 className="text-xl font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  </Link>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500">Selamat datang kembali!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard 
          to="/pos"
          icon={<ShoppingCart className="w-10 h-10" />}
          title="Kasir"
          description="Catat transaksi penjualan baru"
          color="indigo"
        />
        <DashboardCard 
          to="/inventory"
          icon={<Package className="w-10 h-10" />}
          title="Stok Barang"
          description="Kelola stok dan kategori produk"
          color="emerald"
        />
        <DashboardCard 
          to="/debt"
          icon={<BookOpen className="w-10 h-10" />}
          title="Buku Hutang"
          description="Catatan hutang pelanggan"
          color="amber"
        />
        <DashboardCard 
          to="/profile"
          icon={<Settings className="w-10 h-10" />}
          title="Profil Warung"
          description="Pengaturan toko dan akun"
          color="slate"
        />
      </div>
    </div>
  );
};

export default Dashboard;
