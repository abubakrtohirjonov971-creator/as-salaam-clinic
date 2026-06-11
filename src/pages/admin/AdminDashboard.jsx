import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { MdCalendarToday, MdPeople, MdMeetingRoom, MdAttachMoney, MdChevronRight, MdCheck, MdClose, MdEdit, MdDelete } from 'react-icons/md';
import { supabase } from '../../lib/supabase';

// Dynamic data will be fetched from Supabase

const AdminDashboard = () => {
  const doctors = useSelector((state) => state.doctors.items);
  
  const [stats, setStats] = useState({
    todayBookings: 0,
    totalPatients: 0,
    emptyRooms: 0,
    recentBookings: [],
    chartData: [],
    monthlyRevenue: 0
  });

  const [isSendingReport, setIsSendingReport] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchDashboardStats();

    // Real-time: auto-refresh dashboard when bookings or patients change
    const bookingChannel = supabase
      .channel('dashboard-bookings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchDashboardStats();
      })
      .subscribe();

    const patientChannel = supabase
      .channel('dashboard-patients')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        fetchDashboardStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bookingChannel);
      supabase.removeChannel(patientChannel);
    };
  }, []);

  // --- Action handlers ---
  const handleStatusChange = async (booking, newStatus, newStatusColor) => {
    try {
      await supabase
        .from('bookings')
        .update({ status: newStatus, statuscolor: newStatusColor })
        .eq('id', booking.id);

      const cleanPhone = booking.phone?.includes('|tg:') ? booking.phone.split('|tg:')[0] : booking.phone;
      const tgChatId = booking.phone?.includes('|tg:') ? booking.phone.split('|tg:')[1] : '';

      if (newStatus === 'Qabul qilindi') {
        // Check if patient already exists by phone to avoid duplicates
        const { data: existing } = await supabase
          .from('patients')
          .select('id')
          .eq('phone', cleanPhone)
          .limit(1);

        if (!existing || existing.length === 0) {
          const initials = booking.initials || booking.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
          await supabase
            .from('patients')
            .insert([{
              name: booking.name,
              phone: cleanPhone,
              initials: initials || 'N',
              color: booking.color || 'bg-blue-100 text-blue-700',
              doctor: booking.doctor || '',
              status: 'Kutilmoqda',
              age: 0,
              address: 'Andijon',
              diagnosis: 'Boshlang\'ich ko\'rik'
            }]);
        }

        // Send direct confirmation message to patient on Telegram
        if (tgChatId) {
          const BOT_TOKEN = '8121379847:AAHKoY9Nj1HzPSOx4hIbV1CF6kYhnY91WSU';
          const confirmationText = 
            `✅ *AS-SALAAM CLINIC — BRONINGIZ TASDIQLANDI!*\n\n` +
            `Hurmatli *${booking.name}*, shifokor qabuliga yozilgan broningiz tasdiqlandi!\n\n` +
            `👨‍⚕️ Shifokor: *${booking.doctor}*\n` +
            `📅 Sana: *${booking.date}*\n` +
            `⏰ Vaqt: *${booking.time}*\n\n` +
            `Klinikamizda sizni kutib qolamiz! Salomat bo'ling! 🏥`;

          await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: tgChatId,
              text: confirmationText,
              parse_mode: 'Markdown'
            })
          }).catch(err => console.error('Telegram user notification error:', err));
        }
      }

      fetchDashboardStats();
      window.dispatchEvent(new Event('booking-updated'));
    } catch (err) {
      console.error(err);
    }
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const openDelete = (booking) => { setDeleteTarget(booking); setIsDeleteOpen(true); };
  const confirmDelete = async () => {
    await supabase.from('bookings').delete().eq('id', deleteTarget.id);
    setIsDeleteOpen(false); setDeleteTarget(null);
    fetchDashboardStats();
    window.dispatchEvent(new Event('booking-updated'));
  };
  
  const openEdit = (booking) => { 
    const tgChatId = booking.phone?.includes('|tg:') ? booking.phone.split('|tg:')[1] : '';
    const cleanPhone = booking.phone?.includes('|tg:') ? booking.phone.split('|tg:')[0] : booking.phone;
    setEditData({ ...booking, phone: cleanPhone, telegram_chat_id: tgChatId }); 
    setIsEditOpen(true); 
  };

  const saveEdit = async () => {
    const finalPhone = editData.telegram_chat_id ? `${editData.phone}|tg:${editData.telegram_chat_id}` : editData.phone;
    const { telegram_chat_id, ...dataToSave } = editData;
    dataToSave.phone = finalPhone;

    await supabase.from('bookings').update(dataToSave).eq('id', editData.id);
    
    if (editData.status === 'Qabul qilindi') {
      const { data: existing } = await supabase
        .from('patients')
        .select('id')
        .eq('phone', editData.phone)
        .limit(1);

      if (!existing || existing.length === 0) {
        const initials = editData.initials || editData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        await supabase
          .from('patients')
          .insert([{
            name: editData.name,
            phone: editData.phone,
            initials: initials || 'N',
            color: editData.color || 'bg-blue-100 text-blue-700',
            doctor: editData.doctor || '',
            status: 'Kutilmoqda',
            age: 0,
            address: 'Andijon',
            diagnosis: 'Boshlang\'ich ko\'rik'
          }]);
      }

      // Send direct confirmation message to patient on Telegram
      if (editData.telegram_chat_id) {
        const BOT_TOKEN = '8121379847:AAHKoY9Nj1HzPSOx4hIbV1CF6kYhnY91WSU';
        const confirmationText = 
          `✅ *AS-SALAAM CLINIC — BRONINGIZ TASDIQLANDI!*\n\n` +
          `Hurmatli *${editData.name}*, shifokor qabuliga yozilgan broningiz tasdiqlandi!\n\n` +
          `👨‍⚕️ Shifokor: *${editData.doctor}*\n` +
          `📅 Sana: *${editData.date}*\n` +
          `⏰ Vaqt: *${editData.time}*\n\n` +
          `Klinikamizda sizni kutib qolamiz! Salomat bo'ling! 🏥`;

        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: editData.telegram_chat_id,
            text: confirmationText,
            parse_mode: 'Markdown'
          })
        }).catch(err => console.error('Telegram user notification error:', err));
      }
    }

    setIsEditOpen(false); setEditData(null);
    fetchDashboardStats();
    window.dispatchEvent(new Event('booking-updated'));
  };

  const handleSendWeeklyReport = async () => {
    setIsSendingReport(true);
    try {
      const blob = await new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');

        // Gradient Background
        const bgGrad = ctx.createLinearGradient(0, 0, 800, 600);
        bgGrad.addColorStop(0, '#0F2027');
        bgGrad.addColorStop(0.5, '#203A43');
        bgGrad.addColorStop(1, '#2C5364');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 800, 600);

        // Decor circles
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.beginPath(); ctx.arc(100, 100, 150, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(700, 500, 200, 0, Math.PI * 2); ctx.fill();

        // Header
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('AS-SALAAM CLINIC', 50, 70);

        ctx.fillStyle = '#00D1FF';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('HAFTALIK HISOBOT JADVALI', 50, 100);

        // Date range
        const today = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 6);
        const dateRangeStr = `${weekAgo.toLocaleDateString('uz-UZ')} — ${today.toLocaleDateString('uz-UZ')}`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '14px sans-serif';
        ctx.fillText(`Sana: ${dateRangeStr}`, 50, 125);

        // Divider
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(50, 145); ctx.lineTo(750, 145); ctx.stroke();

        // Stats blocks
        const totalWBookings = stats.chartData.reduce((sum, d) => sum + d.qabullar, 0);
        const statsData = [
          { label: 'HAFTALIK QABULLAR', value: totalWBookings, color: '#00D1FF' },
          { label: 'BUGUNGI QABULLAR', value: stats.todayBookings, color: '#00FF66' },
          { label: "BO'SH XONALAR", value: stats.emptyRooms, color: '#FFB800' }
        ];

        statsData.forEach((item, index) => {
          const x = 50 + index * 245;
          const y = 170;
          const w = 210;
          const h = 100;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x, y, w, h, 12); else ctx.rect(x, y, w, h);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.stroke();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(item.label, x + 20, y + 30);

          ctx.fillStyle = item.color;
          ctx.font = 'bold 32px sans-serif';
          ctx.fillText(item.value.toString(), x + 20, y + 70);
        });

        // Chart box
        const chartY = 295;
        const chartH = 210;
        const chartW = 700;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(50, chartY, chartW, chartH, 16); else ctx.rect(50, chartY, chartW, chartH);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('Kunlik qabullar grafigi (Oxirgi 7 kun)', 70, chartY + 35);

        // Chart draw
        const maxVal = Math.max(5, ...stats.chartData.map(d => d.qabullar));
        const barWidth = 36;
        const spacing = 75;
        const startX = 120;

        stats.chartData.forEach((data, idx) => {
          const height = (data.qabullar / maxVal) * 110;
          const x = startX + idx * spacing;
          const y = chartY + 160 - height;

          const barGrad = ctx.createLinearGradient(x, y, x, chartY + 160);
          barGrad.addColorStop(0, '#00D1FF');
          barGrad.addColorStop(1, '#0052CC');

          ctx.fillStyle = barGrad;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(x - barWidth / 2, y, barWidth, height, [4, 4, 0, 0]);
          else ctx.rect(x - barWidth / 2, y, barWidth, height);
          ctx.fill();

          if (data.qabullar > 0) {
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.qabullar.toString(), x, y - 8);
          }

          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(data.name, x, chartY + 180);
        });

        ctx.textAlign = 'left';

        // Footer
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '11px sans-serif';
        ctx.fillText('As-salaam Clinic Admin Panel • Telegram Bot Integration', 50, 565);
        ctx.fillText(new Date().toLocaleString('uz-UZ'), 580, 565);

        canvas.toBlob((b) => resolve(b), 'image/png');
      });

      const BOT_TOKEN = '8121379847:AAHKoY9Nj1HzPSOx4hIbV1CF6kYhnY91WSU';
      const CHAT_ID = '8054469979';
      
      const formData = new FormData();
      formData.append('chat_id', CHAT_ID);
      formData.append('photo', blob, 'weekly_report.png');
      
      const totalWBookings = stats.chartData.reduce((sum, d) => sum + d.qabullar, 0);
      const captionText = 
        `📊 *AS-SALAAM CLINIC — HAFTALIK HISOBOT*\n\n` +
        `🏥 *Klinika holati:*\n` +
        `• Jami haftalik qabullar: *${totalWBookings} ta*\n` +
        `• Bugungi qabullar: *${stats.todayBookings} ta*\n` +
        `• Bo'sh xonalar: *${stats.emptyRooms} ta*\n` +
        `• Oylik jami tushum: *${stats.monthlyRevenue.toLocaleString()} so'm*\n\n` +
        `📅 _Hisobot yaratilgan vaqt: ${new Date().toLocaleString('uz-UZ')}_`;
        
      formData.append('caption', captionText);
      formData.append('parse_mode', 'Markdown');

      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
      });
      const resData = await response.json();

      if (resData.ok) {
        setToast({ show: true, message: '📊 Haftalik hisobot rasm ko\'rinishida Telegram botga muvaffaqiyatli yuborildi! 🚀', type: 'success' });
      } else {
        throw new Error(resData.description || 'Noma\'lum xato');
      }
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: `❌ Xatolik yuz berdi: ${err.message || err}`, type: 'error' });
    } finally {
      setIsSendingReport(false);
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch patients count
      const { count: patientsCount, error: pError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      // Fetch empty rooms count
      const { count: roomsCount, error: rError } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Bo\'sh');

      // Helper to get YYYY-MM-DD in client's local timezone
      const getLocalDateString = (d = new Date()) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Fetch today's bookings count separately
      const todayStr = getLocalDateString();
      const { count: todayCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('date', todayStr);

      const { data: bookingsData, error: bError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5); // Recent 5 bookings

      if (pError || rError || bError) throw new Error('Data fetch failed');

      // Fetch bookings for the last 7 days for the chart
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Include today, so -6
      const formattedDate = getLocalDateString(sevenDaysAgo);

      const { data: chartBookings } = await supabase
        .from('bookings')
        .select('date')
        .gte('date', formattedDate);

      // Generate last 7 days structure
      const chartDataMap = {};
      const uzDays = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'];
      
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = getLocalDateString(d);
        const dayName = uzDays[d.getDay()];
        chartDataMap[dateStr] = { name: dayName, qabullar: 0 };
      }

      if (chartBookings) {
        chartBookings.forEach(b => {
          if (chartDataMap[b.date]) {
            chartDataMap[b.date].qabullar += 1;
          }
        });
      }

      const finalChartData = Object.values(chartDataMap);

      // Fetch payments for the current month to calculate revenue
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const startOfMonthStr = getLocalDateString(startOfMonth);

      const { data: monthPayments } = await supabase
        .from('payments')
        .select('amount')
        .gte('created_at', startOfMonthStr);

      let totalRevenue = 0;
      
      if (monthPayments) {
        totalRevenue = monthPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      }

      setStats({
        todayBookings: todayCount || 0,
        totalPatients: patientsCount || 0,
        emptyRooms: roomsCount || 0,
        recentBookings: bookingsData || [],
        chartData: finalChartData,
        monthlyRevenue: totalRevenue
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-medium text-white transition-all max-w-[90vw] text-sm ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* WELCOME SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Xayrli kun!</h2>
          <p className="text-gray-500">Bugungi klinika holati bilan tanishing.</p>
        </div>
        <button 
          onClick={handleSendWeeklyReport}
          disabled={isSendingReport}
          className="flex items-center gap-2 bg-[#0052CC] hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl active:scale-[0.98] transition-all shadow-md text-sm disabled:opacity-50"
        >
          {isSendingReport ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Yuborilmoqda...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.75-.81 3.51-1.15 4.96-.14.61-.37 1.21-.53 1.34-.34.3-.61.35-.91.17-.23-.14-.52-.39-.93-.66-.63-.42-.99-.68-1.61-1.08-.71-.47-.25-.73.16-1.14.1-.11 1.95-1.79 1.99-1.95.01-.02.01-.1-.05-.15s-.15-.03-.22-.02c-.09.02-1.53.97-4.32 2.85-.41.28-.78.42-1.12.41-.37-.01-1.07-.21-1.6-.38-.64-.21-1.16-.32-1.11-.68.02-.19.28-.38.77-.57 3.01-1.31 5.02-2.18 6.03-2.61 2.87-1.22 3.46-1.43 3.85-1.44.09 0 .28.02.4.12.1.09.13.21.14.31-.01.12-.02.32-.04.47z"/>
              </svg>
              Haftalik hisobot (Telegram)
            </>
          )}
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <MdCalendarToday size={24} />
            </div>
            <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded-lg">+12%</span>
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Bugungi qabullar</p>
            <h3 className="text-2xl font-black text-gray-900">{stats.todayBookings}</h3>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-purple-50 text-purple-600 p-3 rounded-xl">
              <MdPeople size={24} />
            </div>
            <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded-lg">+5%</span>
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Jami bemorlar</p>
            <h3 className="text-2xl font-black text-gray-900">{stats.totalPatients}</h3>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-orange-50 text-orange-600 p-3 rounded-xl">
              <MdMeetingRoom size={24} />
            </div>
            <span className="text-gray-400 text-xs font-medium">Holat</span>
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Bo'sh xonalar</p>
            <h3 className="text-2xl font-black text-gray-900">{stats.emptyRooms}</h3>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-green-50 text-green-600 p-3 rounded-xl">
              <MdAttachMoney size={24} />
            </div>
            <span className="bg-green-50 text-green-600 text-xs font-bold px-2 py-1 rounded-lg">+24%</span>
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm mb-1">Daromad (Oylik)</p>
            <h3 className="text-2xl font-black text-gray-900">
              {stats.monthlyRevenue.toLocaleString()} so'm
            </h3>
          </div>
        </div>
      </div>

      {/* CHARTS & RIGHT SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MAIN CHART */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-900 text-lg">Qabullar statistikasi</h3>
            <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none">
              <option>Oxirgi 7 kun</option>
              <option>Oxirgi 30 kun</option>
            </select>
          </div>
          <div className="flex-1 w-full h-72 mt-4 relative">
            {/* Y-axis labels and grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 text-xs text-gray-400">
              {[4, 3, 2, 1, 0].map((tick) => {
                // Calculate max value for scaling, minimum max is 5
                const maxVal = Math.max(5, ...stats.chartData.map(d => d.qabullar));
                const tickValue = Math.round((maxVal / 4) * tick);
                return (
                  <div key={tick} className="flex items-center w-full relative">
                    <span className="w-8 text-right pr-2">{tickValue}</span>
                    <div className="flex-1 border-t border-dashed border-gray-200"></div>
                  </div>
                );
              })}
            </div>

            {/* Bars container */}
            <div className="absolute inset-0 pl-8 pb-8 pt-2 flex items-end justify-between">
              {stats.chartData.map((data, index) => {
                const maxVal = Math.max(5, ...stats.chartData.map(d => d.qabullar));
                const heightPercentage = (data.qabullar / maxVal) * 100;
                
                return (
                  <div key={index} className="flex flex-col items-center justify-end h-full w-full group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none z-10 whitespace-nowrap">
                      {data.qabullar} ta qabul
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-4 sm:w-8 md:w-12 bg-[#0052CC] rounded-t-md transition-all duration-500 group-hover:bg-[#0747A6]"
                      style={{ height: `${heightPercentage}%`, minHeight: data.qabullar > 0 ? '4px' : '0px' }}
                    ></div>
                    {/* X-axis label */}
                    <div className="absolute -bottom-6 text-xs text-gray-500 font-medium">
                      {data.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DOCTORS STATUS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 text-lg mb-6">Shifokorlar holati</h3>
          <div className="space-y-6">
            {doctors.slice(0, 3).map((doctor, index) => (
              <div key={doctor.id} className="flex justify-between items-center group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={doctor.image || 'https://via.placeholder.com/150'} 
                      alt={doctor.name} 
                      className="w-12 h-12 rounded-full object-cover border border-gray-200" 
                    />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${index % 2 === 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{doctor.name}</h4>
                    <p className="text-xs text-gray-500">{doctor.specialty} • {index === 0 ? 'Band' : 'Bo\'sh'}</p>
                  </div>
                </div>
                <MdChevronRight className="text-gray-400 group-hover:text-primary transition-colors" size={20} />
              </div>
            ))}
          </div>
          
          <button className="w-full mt-8 py-3 text-sm font-bold text-primary bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            Barchasini ko'rish
          </button>
        </div>

      </div>

      {/* RECENT BOOKINGS TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900 text-lg">Oxirgi bronlar</h3>
          <button className="text-sm font-bold text-primary hover:text-primary-dark">To'liq ro'yxat</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Mijoz Ismi</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Telefon</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Shifokor</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Holati</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              
              {stats.recentBookings.length > 0 ? stats.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${booking.color?.split(' ')[1] || 'bg-blue-100'} ${booking.color?.split(' ')[0] || 'text-blue-600'} flex items-center justify-center text-xs font-bold`}>
                        {booking.initials || 'US'}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{booking.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {booking.phone?.includes('|tg:') ? booking.phone.split('|tg:')[0] : booking.phone}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{booking.doctor}</td>
                  <td className="py-4 px-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${booking.statuscolor || 'bg-gray-100 text-gray-700'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {booking.status === 'Kutilmoqda' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking, 'Qabul qilindi', 'text-green-700 bg-green-50')}
                            title="Qabul qilish"
                            className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                          >
                            <MdCheck size={16} />
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking, 'Bekor qilindi', 'text-red-700 bg-red-50')}
                            title="Bekor qilish"
                            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <MdClose size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => openEdit(booking)}
                        title="Tahrirlash"
                        className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                      >
                        <MdEdit size={16} />
                      </button>
                      <button
                        onClick={() => openDelete(booking)}
                        title="O'chirish"
                        className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    Oxirgi qabullar yo'q
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* DELETE MODAL */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDelete size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">O'chirasizmi?</h3>
            <p className="text-gray-500 text-sm mb-6">
              <span className="font-bold text-gray-800">{deleteTarget?.name}</span> bronini o'chirish amali ortga qaytarilmaydi.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold px-4 py-2.5 rounded-xl hover:bg-gray-200">Yo'q</button>
              <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl hover:bg-red-600">O'chirish</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && editData && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Bronni tahrirlash</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-400 hover:text-gray-600"><MdClose size={22} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ism</label>
                  <input type="text" value={editData.name || ''} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Telefon</label>
                  <input type="text" value={editData.phone || ''} onChange={(e) => setEditData({...editData, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Sana</label>
                  <input type="date" value={editData.date || ''} onChange={(e) => setEditData({...editData, date: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Vaqt</label>
                  <input type="text" value={editData.time || ''} onChange={(e) => setEditData({...editData, time: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Shifokor</label>
                <input type="text" value={editData.doctor || ''} onChange={(e) => setEditData({...editData, doctor: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  value={editData.status || 'Kutilmoqda'}
                  onChange={(e) => {
                    const status = e.target.value;
                    let color = 'text-yellow-700 bg-yellow-50';
                    if (status === 'Qabul qilindi') color = 'text-green-700 bg-green-50';
                    if (status === 'Bekor qilindi') color = 'text-red-700 bg-red-50';
                    setEditData({...editData, status, statuscolor: color});
                  }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                >
                  <option value="Kutilmoqda">Kutilmoqda</option>
                  <option value="Qabul qilindi">Qabul qilindi</option>
                  <option value="Bekor qilindi">Bekor qilindi</option>
                </select>
              </div>
              <div className="flex gap-4 pt-2 border-t border-gray-100">
                <button onClick={() => setIsEditOpen(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold px-4 py-2.5 rounded-xl hover:bg-gray-200 text-sm">Bekor</button>
                <button onClick={saveEdit} className="flex-1 bg-[#0052CC] text-white font-bold px-4 py-2.5 rounded-xl hover:bg-blue-700 text-sm">Saqlash</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
