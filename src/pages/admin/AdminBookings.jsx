import React, { useState, useEffect } from 'react';
import { 
  MdEventNote, 
  MdAccessTime, 
  MdFilterList, 
  MdCheck, 
  MdClose, 
  MdEdit,
  MdDelete,
  MdChevronLeft,
  MdChevronRight,
  MdAdd,
  MdSearch
} from 'react-icons/md';
import { supabase } from '../../lib/supabase';

const AdminBookings = () => {
  const [activeTab, setActiveTab] = useState('Barchasi');
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch bookings on mount + real-time subscription
  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel('bookings-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchBookings();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const openEdit = (booking) => {
    const tgChatId = booking.phone?.includes('|tg:') ? booking.phone.split('|tg:')[1] : '';
    const cleanPhone = booking.phone?.includes('|tg:') ? booking.phone.split('|tg:')[0] : booking.phone;
    setEditData({ ...booking, phone: cleanPhone, telegram_chat_id: tgChatId });
    setIsEditOpen(true);
  };
  
  const closeEdit = () => {
    setIsEditOpen(false);
    setEditData(null);
  };

  const saveEdit = async () => {
    try {
      const finalPhone = editData.telegram_chat_id ? `${editData.phone}|tg:${editData.telegram_chat_id}` : editData.phone;
      const { telegram_chat_id, ...dataToSave } = editData;
      dataToSave.phone = finalPhone;

      const { error } = await supabase
        .from('bookings')
        .update(dataToSave)
        .eq('id', editData.id);
        
      if (error) throw error;

      if (editData.status === 'Qabul qilindi') {
        // Check if patient already exists by phone to avoid duplicates
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

      fetchBookings();
      window.dispatchEvent(new Event('booking-updated'));
      closeEdit();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Tahrirlashda xatolik yuz berdi.');
    }
  };

  const openAdd = () => {
    setEditData({
      name: '',
      initials: '',
      color: 'bg-gray-100 text-gray-600',
      phone: '',
      date: '',
      time: '',
      doctor: '',
      room: '',
      status: 'Kutilmoqda',
      statuscolor: 'text-yellow-700 bg-yellow-50'
    });
    setIsAddOpen(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    setEditData(null);
  };

  const addBooking = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([editData]);
        
      if (error) throw error;
      fetchBookings();
      closeAdd();
    } catch (error) {
      console.error('Error adding booking:', error);
      alert('Qo\'shishda xatolik yuz berdi.');
    }
  };

  const openDelete = (booking) => {
    setDeleteTarget(booking);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', deleteTarget.id);
        
      if (error) throw error;
      fetchBookings();
      window.dispatchEvent(new Event('booking-updated'));
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert('O\'chirishda xatolik yuz berdi.');
    }
  };
  
  // Status changing functions
  const handleStatusChange = async (booking, newStatus, newStatusColor) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus, statuscolor: newStatusColor })
        .eq('id', booking.id);
        
      if (error) throw error;

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

      fetchBookings();
      window.dispatchEvent(new Event('booking-updated'));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Holatni o\'zgartirishda xatolik yuz berdi.');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.phone.includes(searchTerm);
    if (!matchesSearch) return false;
    
    if (activeTab === 'Barchasi') return true;
    if (activeTab === 'Yangilar') return b.status === 'Kutilmoqda';
    if (activeTab === 'Bugun') return b.date.includes('Bugun') || b.date.includes('Oktyabr'); 
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto pb-20 relative">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bronlarni boshqarish</h2>
          <p className="text-gray-500">Klinikaga kelayotgan navbatlarni va shifokorlar vaqtini nazorat qiling</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hidden md:flex items-center gap-4 min-w-[200px]">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
              <MdEventNote size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">Jami bronlar</p>
              <h3 className="text-xl font-bold text-gray-900">{bookings.length}</h3>
            </div>
          </div>
          
          <button 
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#0052CC] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            <MdAdd size={20} />
            Bron qo'shish
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        {/* Table Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex gap-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {['Barchasi', 'Yangilar', 'Bugun'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'text-[#0052CC] border-b-2 border-[#0052CC]' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MdSearch className="text-gray-400" size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Ism yoki telefon qidirish..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-50 text-gray-800 text-sm rounded-xl pl-12 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#0052CC]/20 transition-all border border-gray-200"
              />
            </div>
            <button className="flex items-center gap-2 text-gray-600 font-medium hover:text-[#0052CC] transition-colors bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 w-full md:w-auto justify-center">
              <MdFilterList size={20} />
              Filtr
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ism</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Telefon</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Sana va Vaqt</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Shifokor va Xona</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${booking.color}`}>
                        {booking.initials}
                      </div>
                      <span className="font-medium text-gray-900">{booking.name}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-gray-600">
                    {booking.phone?.includes('|tg:') ? booking.phone.split('|tg:')[0] : booking.phone}
                    {booking.phone?.includes('|tg:') && (
                      <span className="ml-1.5 inline-flex items-center gap-0.5 text-xs font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15.75-.81 3.51-1.15 4.96-.14.61-.37 1.21-.53 1.34-.34.3-.61.35-.91.17-.23-.14-.52-.39-.93-.66-.63-.42-.99-.68-1.61-1.08-.71-.47-.25-.73.16-1.14.1-.11 1.95-1.79 1.99-1.95.01-.02.01-.1-.05-.15s-.15-.03-.22-.02c-.09.02-1.53.97-4.32 2.85-.41.28-.78.42-1.12.41-.37-.01-1.07-.21-1.6-.38-.64-.21-1.16-.32-1.11-.68.02-.19.28-.38.77-.57 3.01-1.31 5.02-2.18 6.03-2.61 2.87-1.22 3.46-1.43 3.85-1.44.09 0 .28.02.4.12.1.09.13.21.14.31-.01.12-.02.32-.04.47z"/></svg>
                        TG
                      </span>
                    )}
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-gray-900 font-medium">{booking.date}</p>
                    <p className="text-gray-500 text-sm">{booking.time}</p>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-primary font-medium">{booking.doctor}</p>
                    <p className="text-gray-500 text-sm">Xona: {booking.room}</p>
                  </td>
                  <td className="py-5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${booking.statuscolor || 'text-gray-700 bg-gray-50'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${(booking.statuscolor || 'text-gray-700 bg-gray-50').replace('bg-', 'bg-').replace('50', '500').split(' ')[0].replace('text-', 'bg-')}`}></span>
                      {booking.status || 'Noma\'lum'}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {booking.status === 'Kutilmoqda' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(booking, 'Qabul qilindi', 'text-green-700 bg-green-50')}
                            className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                          >
                            <MdCheck size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(booking, 'Bekor qilindi', 'text-red-700 bg-red-50')}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                          >
                            <MdClose size={18} />
                          </button>
                        </>
                      )}
                      <button
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors ml-1"
                        onClick={() => openEdit(booking)}
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors ml-1"
                        onClick={() => openDelete(booking)}
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Bronlar topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500">Jami {bookings.length} tadan {filteredBookings.length} ta ko'rsatilmoqda</p>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
              <MdChevronLeft size={20} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white font-medium shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">
              <MdChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blue Banner */}
        <div className="bg-[#0052CC] rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-3">Navbatlarni optimallashtirish</h3>
            <p className="text-blue-100 mb-6 max-w-sm">
              Avtomatik tizim yordamida shifokorlar vaqtini 20% gacha tejang.
            </p>
            <button className="bg-white text-[#0052CC] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
              Batafsil
            </button>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20">
            <svg width="200" height="150" viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 150L100 100L150 120L200 50" stroke="white" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="50" cy="150" r="15" fill="white"/>
              <circle cx="100" cy="100" r="15" fill="white"/>
              <circle cx="150" cy="120" r="15" fill="white"/>
              <circle cx="200" cy="50" r="15" fill="white"/>
            </svg>
          </div>
        </div>

        {/* White Banner */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">SMS-Xabarnomalar</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              Bemorlarni qabul vaqti haqida avtomatik ravishda xabardor qiling.
            </p>
          </div>
          <div className="flex justify-between items-end">
            <button className="border-2 border-[#0052CC] text-[#0052CC] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
              Sozlash
            </button>
            <div className="w-16 h-12 bg-[#EAF2FF] rounded-t-2xl rounded-bl-2xl rounded-br-sm relative flex items-center justify-center gap-1.5 opacity-80">
               <div className="w-2 h-2 rounded-full bg-[#0052CC]/40"></div>
               <div className="w-2 h-2 rounded-full bg-[#0052CC]/40"></div>
               <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#EAF2FF]" style={{clipPath: 'polygon(0 0, 0% 100%, 100% 0)'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {(isEditOpen || isAddOpen) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{isEditOpen ? 'Bronni tahrirlash' : 'Yangi bron qo\'shish'}</h3>
              <button onClick={isEditOpen ? closeEdit : closeAdd} className="text-gray-400 hover:text-gray-600 transition-colors">
                <MdClose size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); isEditOpen ? saveEdit() : addBooking(); }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                  <input required type="text" value={editData?.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="Mijoz ismi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initials (Bosh harflar)</label>
                  <input required type="text" value={editData?.initials || ''} onChange={(e) => setEditData({ ...editData, initials: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="AB" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input required type="text" value={editData?.phone || ''} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="+998 90 123 45 67" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sana</label>
                  <input required type="text" value={editData?.date || ''} onChange={(e) => setEditData({ ...editData, date: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="Masalan: 12 Oktyabr, 2023" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vaqti</label>
                  <input required type="text" value={editData?.time || ''} onChange={(e) => setEditData({ ...editData, time: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="14:30" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shifokor</label>
                  <input required type="text" value={editData?.doctor || ''} onChange={(e) => setEditData({ ...editData, doctor: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="Shifokor ismi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xona</label>
                  <input required type="text" value={editData?.room || ''} onChange={(e) => setEditData({ ...editData, room: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="Xona raqami" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select 
                    value={editData?.status || 'Kutilmoqda'} 
                    onChange={(e) => {
                      const status = e.target.value;
                      let color = 'text-yellow-700 bg-yellow-50';
                      if(status === 'Qabul qilindi') color = 'text-green-700 bg-green-50';
                      if(status === 'Bekor qilindi') color = 'text-red-700 bg-red-50';
                      setEditData({ ...editData, status, statuscolor: color });
                    }} 
                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50 bg-white"
                  >
                    <option value="Kutilmoqda">Kutilmoqda</option>
                    <option value="Qabul qilindi">Qabul qilindi</option>
                    <option value="Bekor qilindi">Bekor qilindi</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4 mt-6 border-t border-gray-100">
                <button type="button" onClick={isEditOpen ? closeEdit : closeAdd} className="flex-1 bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                  Bekor qilish
                </button>
                <button type="submit" className="flex-1 bg-[#0052CC] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#0041a3] transition-colors">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDelete size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Haqiqatan ham o'chirasizmi?</h3>
            <p className="text-gray-500 mb-6">
              Siz <span className="font-bold text-gray-900">{deleteTarget?.name}</span> bronini o'chirib tashlamoqchisiz. Bu amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                Yo'q
              </button>
              <button onClick={confirmDelete} className="flex-1 bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-600 transition-colors shadow-md">
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
