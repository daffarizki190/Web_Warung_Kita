import React, { useState } from 'react';
import { useStore } from '../context/store';
import { Store, User, Save, Lock, UserPlus, Trash2 } from 'lucide-react';

const Profile = () => {
  const { profile, user, usersList, serverUsers, updateProfile, updatePassword, registerUser, deleteUser } = useStore();
  const [storeData, setStoreData] = useState(profile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'cashier' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [isEditingAccount, setIsEditingAccount] = useState(false);

  const handleStoreUpdate = async (e) => {
    e.preventDefault();
    const success = await updateProfile(storeData);
    if (success) showMessage('success', 'Profil warung berhasil diperbarui');
    else showMessage('error', 'Gagal memperbarui profil');
    if (success) setIsEditingStore(false);
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'Konfirmasi password tidak cocok');
      return;
    }
    const success = await updatePassword(passwordData.currentPassword, passwordData.newPassword);
    if (success) {
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('success', 'Password berhasil diubah');
      setIsEditingAccount(false);
    } else {
      showMessage('error', 'Password saat ini salah atau terjadi kesalahan');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const success = await registerUser(newUser.username, newUser.password, newUser.role);
    if (success) {
      setNewUser({ username: '', password: '', role: 'cashier' });
      showMessage('success', 'Pengguna berhasil ditambahkan');
    } else {
      showMessage('error', 'Gagal menambahkan pengguna');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      await deleteUser(id);
      showMessage('success', 'Pengguna berhasil dihapus');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleCancelStore = () => {
    setStoreData(profile);
    setIsEditingStore(false);
  };

  const handleCancelAccount = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsEditingAccount(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Profil Warung</h2>
        <p className="text-slate-500">Atur informasi toko dan akun Anda</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Informasi Warung</h3>
          </div>

          {isEditingStore ? (
            <form onSubmit={handleStoreUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Warung</label>
                <input
                  type="text"
                  required
                  value={storeData.name}
                  onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alamat</label>
                <textarea
                  rows="3"
                  required
                  value={storeData.address}
                  onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={storeData.whatsapp}
                  onChange={(e) => setStoreData({ ...storeData, whatsapp: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCancelStore}
                  className="w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Nama Warung</p>
                <p className="font-bold text-slate-800">{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Alamat</p>
                <p className="text-slate-800">{profile.address}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Nomor WhatsApp</p>
                <p className="text-slate-800">{profile.whatsapp}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingStore(true)}
                className="w-full py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-slate-50 rounded-full text-slate-600">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Pengaturan Akun</h3>
          </div>

          {isEditingAccount ? (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  disabled
                  value={user.username}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password Saat Ini</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Konfirmasi Password Baru</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCancelAccount}
                  className="w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-full py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Update Password
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Username</p>
                <p className="font-bold text-slate-800">{user.username}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingAccount(true)}
                className="w-full py-2 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 transition-colors"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-indigo-50 rounded-full text-indigo-600">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Manajemen Pengguna</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Add User Form */}
            <div>
              <h4 className="font-semibold text-slate-700 mb-4">Tambah Pengguna Baru</h4>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Peran (Role)</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="cashier">Kasir</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  Tambah Pengguna
                </button>
              </form>
            </div>

            {/* User List */}
            <div>
              <h4 className="font-semibold text-slate-700 mb-4">Daftar Pengguna</h4>
              <div className="space-y-3">
                {(serverUsers && serverUsers.length ? serverUsers : usersList).map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800">{u.username}</p>
                      <span className={`text-xs px-2 py-1 rounded-lg ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    {u.username !== 'admin' && u.id !== user.id && (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Profile;
