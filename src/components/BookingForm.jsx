import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaCalendarAlt, FaUser, FaPhoneAlt, FaCommentAlt, FaSpinner } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

const BookingForm = ({ serviceId, doctorId, className = "" }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: serviceId || '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const initials = formData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    
    // Extract Telegram User ID if running in Telegram WebApp
    let telegramChatId = '';
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      telegramChatId = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
    }
    const finalPhone = telegramChatId ? `${formData.phone}|tg:${telegramChatId}` : formData.phone;
    
    const today = new Date().toISOString().split('T')[0];

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          name: formData.name,
          phone: finalPhone,
          date: today,
          time: 'Tez orada',
          doctor: 'Xizmat orqali',
          room: 'Belgilanmagan',
          status: 'Kutilmoqda',
          statuscolor: 'text-yellow-700 bg-yellow-50',
          color: 'bg-blue-100 text-blue-700',
          initials: initials || 'N'
        }]);

      if (error) throw error;

      // Send telegram notification to clinic group chat or multiple admins
      const BOT_TOKEN = '8121379847:AAHKoY9Nj1HzPSOx4hIbV1CF6kYhnY91WSU';
      const CLINIC_CHAT_IDS = ['8054469979', '6497060879']; // Adminlarning Telegram Chat ID lari
      
      const newBookingText = 
        `🔔 *YANGI QABULGA YOZILISH (Xizmat sahifasidan)!*\n\n` +
        `👤 Bemor: *${formData.name}*\n` +
        `📞 Telefon: *${formData.phone}*${telegramChatId ? '\n🤖 Telegram orqali yozildi' : ''}\n` +
        `📝 Xabar: ${formData.message || "Yo'q"}\n\n` +
        `🏥 _As-salaam Clinic Navbat Tizimi_`;

      await Promise.all(
        CLINIC_CHAT_IDS.map(chat_id =>
          fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id,
              text: newBookingText,
              parse_mode: 'Markdown'
            })
          }).catch(err => console.error('Telegram error:', err))
        )
      );

      setIsSubmitted(true);
    } catch (err) {
      console.error('Xatolik:', err);
      alert("Kechirasiz, xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`bg-white rounded-3xl shadow-xl p-8 relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-0"></div>
      
      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10"
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
              <FaCalendarAlt className="text-primary" />
              Qabulga yozilish
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ism sharifingiz</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Abdulla Oripov"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqamingiz</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FaPhoneAlt />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qo'shimcha xabar (ixtiyoriy)</label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-4 pointer-events-none text-gray-400">
                    <FaCommentAlt />
                  </div>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Sizni qanday muammo bezovta qilyapti?"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? <FaSpinner className="animate-spin" /> : "So'rov yuborish"}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center relative z-10"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">So'rov qabul qilindi!</h3>
            <p className="text-gray-600 mb-8">
              Tez orada operatorlarimiz siz bilan bog'lanishadi.
            </p>
            <button
              onClick={() => {
                setFormData({ name: '', phone: '', service: '', message: '' });
                setIsSubmitted(false);
              }}
              className="text-primary font-bold hover:underline"
            >
              Yangi so'rov yuborish
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingForm;
