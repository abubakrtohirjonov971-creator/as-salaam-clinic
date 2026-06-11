import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  MdAccountBalanceWallet, MdTrendingUp, MdAttachMoney, 
  MdSearch, MdCalendarToday, MdReceiptLong, MdArrowUpward
} from 'react-icons/md';

const AdminFinance = () => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0, thisMonth: 0 });

  useEffect(() => {
    fetchPayments();
    const channel = supabase
      .channel('finance-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payments' }, fetchPayments)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) { setPayments(data); calculateStats(data); }
    } catch (error) {
      console.error('Kassani yuklashda xatolik:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let total = 0, todayTotal = 0, weekTotal = 0, monthTotal = 0;
    data.forEach(p => {
      const pDate = new Date(p.created_at);
      const amt = Number(p.amount) || 0;
      total += amt;
      if (pDate >= today) todayTotal += amt;
      if (pDate >= weekAgo) weekTotal += amt;
      if (pDate >= startOfMonth) monthTotal += amt;
    });
    setStats({ total, today: todayTotal, thisWeek: weekTotal, thisMonth: monthTotal });
  };

  const fmt = (n) => Number(n).toLocaleString('ru-RU');

  const filteredPayments = payments.filter(p =>
    p.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.service?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getServiceColor = (service) => {
    if (!service) return { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
    if (service.toLowerCase().includes('xona')) return { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' };
    if (service.toLowerCase().includes('tahlil')) return { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' };
    return { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' };
  };

  const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'N';
  const avatarColors = ['from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 'from-emerald-400 to-emerald-600', 'from-orange-400 to-orange-600', 'from-pink-400 to-pink-600'];
  const getAvatarColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <div className="max-w-7xl mx-auto pb-20 space-y-8">
      
      {/* ===== HEADER ===== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0052CC] via-[#0065FF] to-[#00B8D9] rounded-3xl p-8 text-white shadow-2xl shadow-blue-500/30">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-2xl">
                <MdAccountBalanceWallet size={26} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Moliya va Kassa</h2>
            </div>
            <p className="text-blue-100 font-medium">Klinika tushumlari, to'lovlar tarixi va hisobotlar</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-3 text-center border border-white/20">
              <p className="text-blue-100 text-xs font-semibold uppercase tracking-wider mb-1">Jami tushum</p>
              <p className="text-2xl font-black">{fmt(stats.total)} <span className="text-base font-medium opacity-80">so'm</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* Today */}
        <div className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
          <div className="flex justify-between items-start mb-5">
            <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-3 rounded-2xl shadow-lg shadow-emerald-200">
              <MdCalendarToday size={22} className="text-white" />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl">
              <MdArrowUpward size={12} /> Bugun
            </span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Kunlik tushum</p>
          <p className="text-3xl font-black text-gray-900">{fmt(stats.today)}</p>
          <p className="text-gray-400 text-sm mt-0.5">so'm</p>
        </div>

        {/* Weekly */}
        <div className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
          <div className="flex justify-between items-start mb-5">
            <div className="bg-gradient-to-br from-violet-400 to-violet-600 p-3 rounded-2xl shadow-lg shadow-violet-200">
              <MdTrendingUp size={22} className="text-white" />
            </div>
            <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1.5 rounded-xl">Oxirgi 7 kun</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Haftalik tushum</p>
          <p className="text-3xl font-black text-gray-900">{fmt(stats.thisWeek)}</p>
          <p className="text-gray-400 text-sm mt-0.5">so'm</p>
        </div>

        {/* Monthly */}
        <div className="group bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
          <div className="flex justify-between items-start mb-5">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-200">
              <MdAttachMoney size={22} className="text-white" />
            </div>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1.5 rounded-xl">Shu oy</span>
          </div>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Oylik tushum</p>
          <p className="text-3xl font-black text-gray-900">{fmt(stats.thisMonth)}</p>
          <p className="text-gray-400 text-sm mt-0.5">so'm</p>
        </div>
      </div>

      {/* ===== PAYMENTS TABLE ===== */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2.5 rounded-xl">
              <MdReceiptLong size={22} className="text-[#0052CC]" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-lg">To'lovlar tarixi</h3>
              <p className="text-gray-400 text-sm">{payments.length} ta to'lov</p>
            </div>
          </div>
          <div className="relative w-full md:w-72">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Bemor yoki xizmat qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 text-sm rounded-2xl pl-12 pr-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-[#0052CC]/20 border border-gray-200 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Sana</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Mijoz</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest">Xizmat</th>
                <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Summa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="4" className="py-4 px-6">
                      <div className="h-8 bg-gray-100 rounded-xl animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : filteredPayments.length > 0 ? (
                filteredPayments.map((payment, idx) => {
                  const svc = getServiceColor(payment.service);
                  return (
                    <tr key={payment.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="text-sm font-semibold text-gray-700">
                          {new Date(payment.created_at).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {new Date(payment.created_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-2xl bg-gradient-to-br ${getAvatarColor(payment.patient_name)} flex items-center justify-center text-xs font-black text-white shadow-sm flex-shrink-0`}>
                            {getInitials(payment.patient_name)}
                          </div>
                          <span className="font-bold text-gray-900 group-hover:text-[#0052CC] transition-colors">
                            {payment.patient_name || 'Noma\'lum'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold ${svc.bg} ${svc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${svc.dot}`}></span>
                          {payment.service}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5 bg-[#0052CC]/5 px-4 py-2 rounded-xl group-hover:bg-[#0052CC]/10 transition-colors">
                          <span className="font-black text-[#0052CC] text-base">{fmt(payment.amount)}</span>
                          <span className="text-[#0052CC]/60 text-xs font-semibold">so'm</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-3xl flex items-center justify-center">
                        <MdReceiptLong size={30} className="text-gray-300" />
                      </div>
                      <p className="font-bold text-gray-400">Hech qanday to'lov topilmadi</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredPayments.length > 0 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-sm text-gray-500 font-medium">{filteredPayments.length} ta natija</p>
            <div className="flex items-center gap-2 bg-[#0052CC]/5 px-4 py-2 rounded-xl">
              <span className="text-sm text-gray-500 font-medium">Jami:</span>
              <span className="font-black text-[#0052CC]">
                {fmt(filteredPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0))} so'm
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFinance;
