import React, { useMemo, useState } from 'react';
import { useStore } from '../context/store';
import { Search, UserCheck, Clock, CheckCircle, Plus, AlertCircle, Trash2, History, Lock } from 'lucide-react';
import Modal from '../components/Modal';

const Debt = () => {
  const { debts, requestDebtPaid, verifyDebtPaid, addDebt, debtHistory, clearDebtsWithPassword } = useStore();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDebtId, setConfirmDebtId] = useState(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearPassword, setClearPassword] = useState('');
  const [clearReason, setClearReason] = useState('');
  const [clearError, setClearError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    amount: '',
    notes: ''
  });

  const filteredDebts = useMemo(() => {
    return debts
      .filter(d => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return !d.is_paid || (d.is_paid && d.paidAt && new Date(d.paidAt) >= sixMonthsAgo);
      })
      .filter(d => d.customerName.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [debts, search]);

  const totalUnpaid = useMemo(() => {
    return debts
      .filter(d => !d.is_paid)
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  }, [debts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.amount || !formData.notes.trim()) return;
    
    await addDebt(formData);
    setFormData({ customerName: '', amount: '', notes: '' });
    setIsModalOpen(false);
  };

  const handleVerifyConfirm = () => {
    if (!confirmDebtId) return;
    verifyDebtPaid(confirmDebtId);
    setConfirmDebtId(null);
  };

  const handleClearDebts = async () => {
    if (!clearPassword.trim()) {
      setClearError('Password wajib diisi');
      return;
    }
    if (!clearReason.trim()) {
      setClearError('Alasan wajib diisi');
      return;
    }
    const ok = await clearDebtsWithPassword(clearPassword.trim(), clearReason.trim());
    if (!ok) {
      setClearError('Password salah atau alasan kosong');
      return;
    }
    setClearError('');
    setClearPassword('');
    setClearReason('');
    setIsClearModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Buku Hutang</h2>
          <p className="text-slate-500">Kelola catatan hutang pelanggan</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-3 flex-1 sm:flex-none justify-center sm:justify-start">
            <span className="text-sm font-medium">Total Piutang</span>
            <span className="text-xl font-bold">Rp {totalUnpaid.toLocaleString()}</span>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-colors shadow-lg shadow-indigo-200"
            title="Tambah Hutang Manual"
          >
            <Plus className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsClearModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl transition-colors shadow-lg shadow-red-200"
            title="Hapus Semua Data Hutang"
          >
            <Trash2 className="w-6 h-6" />
          </button>
          <button
            onClick={() => setShowHistory(v => !v)}
            className="bg-slate-800 hover:bg-slate-900 text-white p-2 rounded-xl transition-colors shadow-lg shadow-slate-200"
            title="Tampilkan Riwayat Hutang"
          >
            <History className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Cari nama pelanggan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filteredDebts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 border-dashed">
          <div className="inline-flex p-4 bg-slate-50 rounded-full mb-4">
            <UserCheck className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Tidak ada catatan hutang</h3>
          <p className="text-slate-500">Semua pelanggan telah melunasi pembayaran</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDebts.map((debt) => (
            <div key={debt.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold">
                    {debt.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{debt.customerName}</h3>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      {new Date(debt.date).toLocaleDateString('id-ID', { 
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Diinput oleh: <span className="font-medium text-slate-600">{debt.createdBy || 'Tidak diketahui'}</span></p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {debt.notes && (
                  <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                    {debt.notes}
                  </p>
                )}

                {debt.items && debt.items.length > 0 && (
                  <div className="border border-slate-100 rounded-lg overflow-hidden">
                    <div className="px-3 py-2 bg-slate-50 text-slate-700 text-sm font-medium">Rincian Belanja</div>
                    <div className="divide-y divide-slate-100">
                      {debt.items.map((it) => (
                        <div key={it.id + '_' + it.name} className="px-3 py-2 flex justify-between text-sm">
                          <span className="text-slate-700">{it.name} × {it.qty}</span>
                          <span className="font-semibold text-slate-800">Rp {Number(it.subtotal || (it.price * it.qty)).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-end pt-2 border-t border-slate-50">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Jumlah Hutang</p>
                    <p className="text-xl font-bold text-red-500">Rp {Number(debt.amount).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!debt.is_paid && !debt.verify_pending && (
                      <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-medium flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> Belum Lunas
                      </span>
                    )}
                    {debt.verify_pending && !debt.is_paid && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium">Menunggu Verifikasi</span>
                    )}
                    {debt.is_paid && (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">Lunas (Terverifikasi)</span>
                    )}
                    {!debt.verify_pending && !debt.is_paid && (
                      <button
                        onClick={() => requestDebtPaid(debt.id)}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 font-medium text-sm"
                      >
                        Ajukan Verifikasi
                      </button>
                    )}
                    {debt.verify_pending && !debt.is_paid && (
                      <button
                        onClick={() => setConfirmDebtId(debt.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 font-medium text-sm"
                      >
                        <CheckCircle className="w-4 h-4" /> Verifikasi Lunas
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showHistory && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-bold text-slate-800">Riwayat Hutang</h3>
          </div>
          {debtHistory.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-2xl border border-slate-100 border-dashed">
              <p className="text-slate-500">Belum ada riwayat</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 divide-y">
              {debtHistory.map((h) => (
                <div key={h.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${h.type === 'ADD_FROM_POS' ? 'bg-indigo-50 text-indigo-700' : h.type === 'ADD_MANUAL' ? 'bg-amber-50 text-amber-700' : h.type === 'REQUEST_VERIFY' ? 'bg-sky-50 text-sky-700' : h.type === 'VERIFY_PAID' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>{h.type}</span>
                    <div>
                      <p className="text-sm text-slate-800 font-medium">{h.customerName || '—'}</p>
                      <p className="text-xs text-slate-500">Rp {(Number(h.amount || h.clearedTotal || 0)).toLocaleString()} • {new Date(h.ts).toLocaleString('id-ID')} • {h.by}</p>
                    </div>
                  </div>
                  {h.transactionId && (
                    <span className="text-xs text-slate-400">Transaksi: {h.transactionId}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Debt Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Hutang Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Pelanggan</label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Contoh: Pak Budi"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Hutang (Rp)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Catatan (Opsional)</label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              required
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tuliskan catatan (wajib)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={!!confirmDebtId}
        onClose={() => setConfirmDebtId(null)}
        title="Verifikasi Pembayaran"
      >
        <div className="space-y-4">
          <p className="text-slate-700">Apa anda yakin sudah dibayar?</p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmDebtId(null)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleVerifyConfirm}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Verifikasi
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Hapus Semua Data Hutang"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <Trash2 className="w-4 h-4" />
            <p className="text-sm font-medium">Tindakan ini akan menghapus semua data hutang</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Masukkan Password Anda</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                value={clearPassword}
                onChange={(e) => setClearPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Password pengguna saat ini"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alasan Penghapusan</label>
            <textarea
              rows="3"
              value={clearReason}
              onChange={(e) => setClearReason(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Tuliskan alasan jelas (wajib)"
            />
            {clearError && <p className="text-red-600 text-sm mt-2">{clearError}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsClearModalOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleClearDebts}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Hapus Data
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Debt;
