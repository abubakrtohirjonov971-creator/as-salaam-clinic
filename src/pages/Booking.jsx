import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUserAlt, FaPhoneAlt, FaCheckCircle, FaSpinner,
  FaHeartbeat, FaBrain, FaStethoscope, FaMapMarkerAlt,
  FaStar, FaInfoCircle, FaChevronLeft, FaChevronRight,
  FaCalendarAlt, FaClock, FaUserMd
} from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';

const DOCTORS = [
  { id: 'alisherov', role: 'Ortoped', name: 'Dr. Alisher', icon: FaHeartbeat, color: 'from-blue-500 to-blue-600' },
  { id: 'karimov', role: 'Neyroxirurg', name: 'Dr. Erkinbek', icon: FaBrain, color: 'from-purple-500 to-purple-600' },
  { id: 'azizova', role: 'Umumiy vrach', name: 'Dr. Abrorbek', icon: FaStethoscope, color: 'from-emerald-500 to-emerald-600' },
  { id: 'ibrohim', role: 'Xirurg', name: 'Dr. Ibrohim', icon: FaUserMd, color: 'from-orange-500 to-orange-600' },
];

const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

const MONTHS_UZ = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
const WEEKDAYS_UZ = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

// ─── Mini Calendar Component ───────────────────────────────────────────────
const Calendar = ({ selectedDate, onSelect }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  // Adjust so week starts Monday
  const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0052CC] to-blue-600">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
          <FaChevronLeft size={12} />
        </button>
        <span className="text-white font-bold text-base">{MONTHS_UZ[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors">
          <FaChevronRight size={12} />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 px-3 pt-3">
        {WEEKDAYS_UZ.map(d => (
          <div key={d} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={idx} />;
          const dateObj = new Date(viewYear, viewMonth, day);
          const isPast = dateObj < today;
          const isSunday = dateObj.getDay() === 0;
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isSelected = selectedDate === dateStr;
          const isToday = dateObj.getTime() === today.getTime();
          const disabled = isPast || isSunday;

          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className={`
                relative mx-auto flex items-center justify-center w-9 h-9 rounded-full text-sm font-medium transition-all
                ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}
                ${isSelected ? 'bg-[#0052CC] text-white shadow-lg shadow-blue-300 hover:bg-[#0052CC]' : ''}
                ${isToday && !isSelected ? 'ring-2 ring-[#0052CC] text-[#0052CC]' : ''}
                ${!isSelected && !disabled && !isToday ? 'text-gray-700' : ''}
              `}
            >
              {day}
              {isSunday && !isPast && <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[8px] text-red-400">Dam</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Phone Input ────────────────────────────────────────────────────────────
const PhoneInput = ({ value, onChange, error }) => {
  const handleChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.startsWith('998')) val = val.slice(3);
    val = val.slice(0, 9);
    
    let formatted = '+998';
    if (val.length > 0) formatted += ' ' + val.slice(0, 2);
    if (val.length > 2) formatted += ' ' + val.slice(2, 5);
    if (val.length > 5) formatted += ' ' + val.slice(5, 7);
    if (val.length > 7) formatted += ' ' + val.slice(7, 9);
    onChange(formatted);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
        <div className={`h-full flex items-center px-4 border-r ${error ? 'border-red-300' : 'border-gray-200'}`}>
          <span className="text-xl">🇺🇿</span>
        </div>
      </div>
      <input
        type="tel"
        value={value}
        onChange={handleChange}
        placeholder="+998 90 123 45 67"
        className={`w-full pl-16 pr-4 py-4 bg-gray-50 border ${error ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100'} rounded-2xl outline-none transition-all text-gray-800 font-medium text-base`}
      />
    </div>
  );
};

// ─── Main Booking Component ─────────────────────────────────────────────────
const Booking = () => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [busySlots, setBusySlots] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch busy slots when doctor + date changes — real-time
  useEffect(() => {
    if (!selectedDoctor || !selectedDate) { setBusySlots([]); return; }
    const doctorName = DOCTORS.find(d => d.id === selectedDoctor)?.name || '';

    const fetchBusy = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('time, status')
          .eq('date', selectedDate)
          .eq('doctor', doctorName)
          .in('status', ['Kutilmoqda', 'Qabul qilindi']);

        if (error) { console.warn('Busy slots warning:', error.message); return; }
        const busy = (data || []).map(b => b.time);
        setBusySlots(busy);
        if (busy.includes(selectedTime)) setSelectedTime('');
      } catch (err) {
        console.warn('Busy slots fetch failed:', err);
      }
    };

    fetchBusy();

    let channel;
    try {
      channel = supabase
        .channel('busy-slots-' + selectedDate + '-' + selectedDoctor)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchBusy)
        .subscribe();
    } catch (e) {
      // ignore realtime errors when DB is offline
    }

    return () => {
      if (channel) {
        try { supabase.removeChannel(channel); } catch (e) {}
      }
    };
  }, [selectedDoctor, selectedDate]);

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Ism kiritilishi shart';
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 12) e.phone = 'Telefon to\'liq kiritilishi shart';
    if (!selectedDoctor) e.doctor = 'Shifokorni tanlang';
    if (!selectedDate) e.date = 'Sanani tanlang';
    if (!selectedTime) e.time = 'Vaqtni tanlang';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) { setErrors(validation); return; }

    setIsSubmitting(true);
    const doctorName = DOCTORS.find(d => d.id === selectedDoctor)?.name || '';
    const initials = formData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    try {
      // 1. Telegram ga yuborish (bir nechta adminlarga bir vaqtning o'zida)
      const BOT_TOKEN = '8121379847:AAHKoY9Nj1HzPSOx4hIbV1CF6kYhnY91WSU';
      const CLINIC_CHAT_IDS = ['8054469979']; // Yangi adminlarning Telegram Chat ID lari
      const dateFormatted = new Date(selectedDate).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
      const msg =
        `🔔 *YANGI QABULGA YOZILISH!*\n\n` +
        `👤 Bemor: *${formData.name}*\n` +
        `📞 Telefon: *${formData.phone}*\n` +
        `👨‍⚕️ Shifokor: *${doctorName}*\n` +
        `📅 Sana: *${dateFormatted}*\n` +
        `⏰ Vaqt: *${selectedTime}*\n\n` +
        `🏥 _As-salaam Clinic Navbat Tizimi_`;
        
      await Promise.all(
        CLINIC_CHAT_IDS.map(chat_id =>
          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id, text: msg, parse_mode: 'Markdown' }),
          }).catch(console.error)
        )
      );

      // 2. Supabase ga yozishga urinib ko'rish (xatolik bersa ham formani to'xtatmaydi)
      try {
        const { data: check } = await supabase
          .from('bookings')
          .select('id')
          .eq('date', selectedDate)
          .eq('time', selectedTime)
          .eq('doctor', doctorName);

        if (check && check.length > 0) {
          console.warn("Baza bo'yicha bu vaqt band bo'lishi mumkin, lekin Telegramga yuborildi.");
        } else {
          await supabase.from('bookings').insert([{
            name: formData.name,
            phone: formData.phone,
            date: selectedDate,
            time: selectedTime,
            doctor: doctorName,
            room: 'Belgilanmagan',
            status: 'Kutilmoqda',
            statuscolor: 'text-yellow-700 bg-yellow-50',
            color: 'bg-blue-100 text-blue-700',
            initials: initials || 'N',
          }]);
        }
      } catch (dbErr) {
        console.warn('Database error ignored:', dbErr);
      }

      setShowSuccess(true);
      setFormData({ name: '', phone: '' });
      setSelectedDoctor(''); setSelectedDate(''); setSelectedTime('');
      setTimeout(() => setShowSuccess(false), 6000);
    } catch (err) {
      console.error(err);
      alert("Xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = (field) => setErrors(prev => ({ ...prev, [field]: null }));

  return (
    <div className="bg-[#F5F7FB] min-h-screen pt-32 pb-24">
      <Helmet>
        <title>Qabulga yozilish | As-salaam Clinic</title>
        <meta name="description" content="As-salaam Clinic malakali shifokorlari qabuliga onlayn yoziling. O'zingizga qulay vaqtni tanlang." />
      </Helmet>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-5 rounded-3xl shadow-2xl shadow-green-200 flex items-center gap-4 font-semibold w-max max-w-[90vw]"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <FaCheckCircle size={22} />
            </div>
            <div>
              <p className="font-bold text-lg">Muvaffaqiyatli yozildingiz!</p>
              <p className="text-green-100 text-sm font-normal">Tez orada siz bilan bog'lanamiz.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-6">
        {/* PAGE HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 border border-blue-100 rounded-full text-[#0052CC] font-bold text-sm mb-5"
          >
            <FaCalendarAlt size={14} />
            Onlayn navbat tizimi
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
          >
            Qabulga yozilish
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 leading-relaxed"
          >
            Shaklni to'ldiring, qulay vaqt tanlang — biz tasdiqlaymiz.
          </motion.p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto items-start">

          {/* ── FORM ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="lg:w-3/5"
          >
            <form onSubmit={handleSubmit} className="space-y-7">

              {/* Name + Phone */}
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 space-y-5">
                <h3 className="font-black text-gray-900 text-lg">Shaxsiy ma'lumotlar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">To'liq isim</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaUserAlt className={errors.name ? 'text-red-400' : 'text-gray-400'} />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => { setFormData(p => ({ ...p, name: e.target.value })); clearError('name'); }}
                        placeholder="Abdulla Oripov"
                        className={`w-full pl-11 pr-4 py-4 bg-gray-50 border ${errors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200 focus:border-[#0052CC] focus:ring-2 focus:ring-blue-100'} rounded-2xl outline-none transition-all text-gray-800 font-medium`}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-gray-600 mb-2">Telefon raqam</label>
                    <PhoneInput
                      value={formData.phone}
                      onChange={v => { setFormData(p => ({ ...p, phone: v })); clearError('phone'); }}
                      error={errors.phone}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Doctor */}
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                <h3 className="font-black text-gray-900 text-lg mb-5">Shifokorni tanlang</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {DOCTORS.map(doc => {
                    const isSelected = selectedDoctor === doc.id;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => { setSelectedDoctor(doc.id); clearError('doctor'); setSelectedTime(''); }}
                        className={`relative p-3.5 rounded-2xl border-2 transition-all duration-300 text-left
                          ${isSelected
                            ? 'border-[#0052CC] bg-blue-50 shadow-md shadow-blue-100'
                            : 'border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50/50'}`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 bg-gradient-to-br ${doc.color} text-white shadow-sm`}>
                          <doc.icon size={18} />
                        </div>
                        <p className={`font-bold text-[13px] leading-tight ${isSelected ? 'text-[#0052CC]' : 'text-gray-800'}`}>{doc.role}</p>
                        <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>{doc.name}</p>
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-[#0052CC] rounded-full flex items-center justify-center">
                            <FaCheckCircle className="text-white" size={12} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.doctor && <p className="text-red-500 text-xs mt-2 font-medium">{errors.doctor}</p>}
              </div>

              {/* Calendar + Time */}
              <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
                <h3 className="font-black text-gray-900 text-lg mb-5">Sana va vaqt tanlang</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2"><FaCalendarAlt className="text-[#0052CC]" /> Qabul sanasi</p>
                    <Calendar selectedDate={selectedDate} onSelect={d => { setSelectedDate(d); clearError('date'); setSelectedTime(''); }} />
                    {selectedDate && (
                      <p className="text-sm font-bold text-[#0052CC] mt-2 text-center">
                        {new Date(selectedDate).toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                    )}
                    {errors.date && <p className="text-red-500 text-xs mt-1 font-medium">{errors.date}</p>}
                  </div>

                  {/* Time Slots */}
                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-3 flex items-center gap-2"><FaClock className="text-[#0052CC]" /> Qabul vaqti</p>
                    {!selectedDate || !selectedDoctor ? (
                      <div className="h-48 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center p-4">
                        <FaClock className="text-gray-300 mb-2" size={28} />
                        <p className="text-gray-400 text-sm font-medium">
                          {!selectedDoctor ? 'Avval shifokorni tanlang' : 'Avval sanani tanlang'}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map(slot => {
                          const isBusy = busySlots.includes(slot);
                          const isSelected = selectedTime === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              disabled={isBusy}
                              onClick={() => { setSelectedTime(slot); clearError('time'); }}
                              className={`py-2.5 rounded-xl text-sm font-bold transition-all
                                ${isBusy
                                  ? 'bg-red-50 text-red-300 border-2 border-red-100 cursor-not-allowed line-through'
                                  : isSelected
                                    ? 'bg-[#0052CC] text-white shadow-md shadow-blue-200 border-2 border-[#0052CC]'
                                    : 'bg-gray-50 text-gray-700 border-2 border-gray-100 hover:border-[#0052CC] hover:text-[#0052CC]'
                                }`}
                            >
                              {isBusy ? `${slot} ✕` : slot}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Legend */}
                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#0052CC] inline-block"></span> Tanlangan</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-100 inline-block"></span> Band</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-100 inline-block border border-gray-200"></span> Bo'sh</span>
                    </div>
                    {errors.time && <p className="text-red-500 text-xs mt-1 font-medium">{errors.time}</p>}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-[#0052CC] to-blue-600 hover:from-[#003E99] hover:to-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-3 text-lg disabled:opacity-70"
              >
                {isSubmitting
                  ? <><FaSpinner className="animate-spin" size={22} /> Yuborilmoqda...</>
                  : <><FaCheckCircle size={20} /> Qabulga yozilish</>
                }
              </button>
            </form>
          </motion.div>

          {/* ── RIGHT COLUMN ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="lg:w-2/5 flex flex-col gap-6 lg:sticky lg:top-28"
          >
            {/* Map */}
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0052CC] mb-4">
                <FaMapMarkerAlt size={20} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Bizning manzil</h3>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">Andijon shahri, Andijon davlat tibbiyot instituti qarshisida.</p>

              {/* Map with title overlay at top */}
              <div className="rounded-2xl overflow-hidden h-52 w-full relative">
                <iframe
                  width="100%" height="100%" frameBorder="0" scrolling="no"
                  src="https://maps.google.com/maps?width=100%25&height=100%25&hl=en&q=As-salaam%20clinic,%20Andijon&t=&z=17&ie=UTF8&iwloc=B&output=embed"
                  title="Clinic Location"
                  className="absolute inset-0 w-full h-full"
                  style={{ filter: 'contrast(1.1)' }}
                />
                {/* Title overlay at top of map */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent px-4 pt-3 pb-6 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-white" size={13} />
                    <span className="text-white font-bold text-sm drop-shadow">Bizning manzil</span>
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=As-salaam+clinic+Andijon"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-[#0052CC] text-[#0052CC] font-bold text-sm hover:bg-blue-50 transition-colors"
              >
                <FaMapMarkerAlt size={13} />
                Xaritada ko'rish
              </a>
            </div>

            {/* Review */}
            <div className="bg-gradient-to-br from-[#0052CC] to-blue-700 rounded-3xl p-7 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex text-yellow-400 mb-4 gap-0.5">
                {[...Array(5)].map((_, i) => <FaStar key={i} size={16} />)}
              </div>
              <p className="text-base leading-relaxed font-medium mb-6 text-blue-50 italic">
                "As-salaam Clinic shifokorlari juda malakali. Qabulga yozilish tizimi tez va qulay, navbatlar yo'qligi meni juda mamnun qildi."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold backdrop-blur-sm">NH</div>
                <div>
                  <p className="font-bold text-white text-sm">Nilufar Hakimova</p>
                  <p className="text-blue-200 text-xs">Doimiy mijoz</p>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 flex-shrink-0">
                <FaInfoCircle size={22} />
              </div>
              <div>
                <p className="font-bold text-gray-800 mb-0.5">Yordam kerakmi?</p>
                <a href="tel:+998905447707" className="text-[#0052CC] font-black text-lg hover:underline flex items-center gap-2">
                  <FaPhoneAlt size={14} /> +998 90 544 77 07
                </a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Booking;
