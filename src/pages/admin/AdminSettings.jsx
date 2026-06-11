import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateProfile,
  updateClinic,
  updateNotifications,
  updateSystem,
  updateSecurity
} from '../../slices/settingsSlice';
import {
  MdPerson,
  MdLocalHospital,
  MdNotifications,
  MdSecurity,
  MdSettings,
  MdEdit,
  MdSave,
  MdClose,
  MdCameraAlt,
  MdCheck,
  MdVisibility,
  MdVisibilityOff,
  MdAutorenew
} from 'react-icons/md';
import { supabase } from '../../lib/supabase';

const tabs = [
  { id: 'profile', label: 'Profil', icon: <MdPerson size={20} /> },
  { id: 'clinic', label: 'Klinika', icon: <MdLocalHospital size={20} /> },
  { id: 'notifications', label: 'Bildirishnomalar', icon: <MdNotifications size={20} /> },
  { id: 'security', label: 'Xavfsizlik', icon: <MdSecurity size={20} /> },
  { id: 'system', label: 'Tizim', icon: <MdSettings size={20} /> },
];

const AdminSettings = () => {
  const dispatch = useDispatch();
  const settingsState = useSelector(state => state.settings);

  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [profile, setProfile] = useState(settingsState.profile);
  const [clinic, setClinic] = useState(settingsState.clinic);
  const [notifications, setNotifications] = useState(settingsState.notifications);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [twoFactor, setTwoFactor] = useState(settingsState.security.twoFactor);
  const [system, setSystem] = useState(settingsState.system);
  
  const [isRestarting, setIsRestarting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    dispatch(updateProfile(profile));
    dispatch(updateClinic(clinic));
    dispatch(updateNotifications(notifications));
    dispatch(updateSystem(system));
    dispatch(updateSecurity({ twoFactor }));

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClearCache = async () => {
    setShowClearModal(false);
    setIsClearing(true);
    try {
      await supabase.from('bookings').delete().neq('id', '0');
      await supabase.from('patients').delete().neq('id', '0');
    } catch (err) {
      console.error(err);
    } finally {
      setIsClearing(false);
    }
  };

  const handleRestart = () => {
    setShowRestartModal(false);
    setIsRestarting(true);
    setTimeout(() => {
      localStorage.clear();
      window.location.href = '/admin';
    }, 1500);
  };

  const Toggle = ({ value, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-[#0052CC]' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto pb-20">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Sozlamalar</h2>
        <p className="text-gray-500">Profil, klinika va tizim sozlamalarini boshqaring</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* SIDEBAR TABS */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-sm ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-[#0052CC]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 space-y-6">

          {/* ===== PROFILE TAB ===== */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Shaxsiy kabinet</h3>

              {/* Avatar */}
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="relative">
                  <img src={profile.avatar} alt="Admin" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
                  <label className="absolute bottom-0 right-0 w-7 h-7 bg-[#0052CC] text-white rounded-full flex items-center justify-center border-2 border-white cursor-pointer">
                    <MdCameraAlt size={14} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{profile.name}</h4>
                  <p className="text-gray-500 text-sm">{profile.role}</p>
                  <label className="text-[#0052CC] text-sm font-medium mt-1 hover:underline cursor-pointer block">
                    Rasmni o'zgartirish
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">To'liq ism</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Lavozim</label>
                  <input type="text" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email manzil</label>
                  <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon raqam</label>
                  <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* ===== CLINIC TAB ===== */}
          {activeTab === 'clinic' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Klinika ma'lumotlari</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Klinika nomi</label>
                  <input type="text" value={clinic.name} onChange={e => setClinic({...clinic, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Manzil</label>
                  <input type="text" value={clinic.address} onChange={e => setClinic({...clinic, address: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon</label>
                  <input type="text" value={clinic.phone} onChange={e => setClinic({...clinic, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={clinic.email} onChange={e => setClinic({...clinic, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ish vaqti</label>
                  <input type="text" value={clinic.workHours} onChange={e => setClinic({...clinic, workHours: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Web-sayt</label>
                  <input type="text" value={clinic.website} onChange={e => setClinic({...clinic, website: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                </div>
              </div>
            </div>
          )}

          {/* ===== NOTIFICATIONS TAB ===== */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
              <h3 className="text-lg font-bold text-gray-900">Bildirishnomalar</h3>

              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Tizim bildirishnomalari</h4>
                <div className="space-y-4">
                  {[
                    { key: 'newBooking', label: 'Yangi bron qo\'shilganda', desc: 'Yangi qabul yozilganda xabardor qiling' },
                    { key: 'bookingCancel', label: 'Bron bekor qilinganda', desc: 'Bemor qabulni bekor qilganda xabardor qiling' },
                    { key: 'labReady', label: 'Tahlil natijasi tayyor bo\'lganda', desc: 'Laboratoriya natijalari tayyor bo\'lganda bildirishnoma yuboring' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle value={notifications[item.key]} onChange={v => setNotifications({...notifications, [item.key]: v})} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Bemorga xabarnomalar</h4>
                <div className="space-y-4">
                  {[
                    { key: 'smsToPatient', label: 'SMS xabarnomalar', desc: 'Bemorga qabul vaqti haqida SMS yuborish' },
                    { key: 'emailToPatient', label: 'Email xabarnomalar', desc: 'Bemorga email orqali eslatma yuborish' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle value={notifications[item.key]} onChange={v => setNotifications({...notifications, [item.key]: v})} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Hisobotlar</h4>
                <div className="space-y-4">
                  {[
                    { key: 'dailyReport', label: 'Kunlik hisobot', desc: 'Har kuni hisobot email ga yuborilsin' },
                    { key: 'weeklyReport', label: 'Haftalik hisobot', desc: 'Har hafta umumiy statistika yuborilsin' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.label}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle value={notifications[item.key]} onChange={v => setNotifications({...notifications, [item.key]: v})} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== SECURITY TAB ===== */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Parolni o'zgartirish</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Joriy parol</label>
                    <div className="relative">
                      <input
                        type={showOldPass ? 'text' : 'password'}
                        value={passwords.oldPassword}
                        onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-12 outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowOldPass(!showOldPass)} className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                        {showOldPass ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Yangi parol</label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={passwords.newPassword}
                        onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-12 outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        placeholder="Kamida 8 ta belgi"
                      />
                      <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                        {showNewPass ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Yangi parolni tasdiqlang</label>
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Ikki bosqichli autentifikatsiya</h3>
                    <p className="text-gray-500 text-sm mt-1">Hisobingizni qo'shimcha xavfsizlik bilan himoya qiling (2FA)</p>
                  </div>
                  <Toggle value={twoFactor} onChange={setTwoFactor} />
                </div>
                {twoFactor && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-700 font-medium">✅ Ikki bosqichli autentifikatsiya yoqilgan. SMS orqali tasdiqlash kodi yuboriladi.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== SYSTEM TAB ===== */}
          {activeTab === 'system' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Tizim sozlamalari</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Til</label>
                  <select value={system.language} onChange={e => setSystem({...system, language: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm bg-white">
                    <option value="uz">O'zbek tili</option>
                    <option value="ru">Русский язык</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Vaqt mintaqasi</label>
                  <select value={system.timezone} onChange={e => setSystem({...system, timezone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm bg-white">
                    <option value="Asia/Tashkent">Asia/Tashkent (UTC+5)</option>
                    <option value="Europe/Moscow">Europe/Moscow (UTC+3)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Valyuta</label>
                  <select value={system.currency} onChange={e => setSystem({...system, currency: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm bg-white">
                    <option value="UZS">UZS — O'zbek so'mi</option>
                    <option value="USD">USD — Dollar</option>
                    <option value="RUB">RUB — Rubl</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sana formati</label>
                  <select value={system.dateFormat} onChange={e => setSystem({...system, dateFormat: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 text-sm bg-white">
                    <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Xavfli zona</h4>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setShowClearModal(true)}
                    disabled={isClearing}
                    className="border-2 border-orange-200 text-orange-600 font-bold px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-colors text-sm disabled:opacity-50"
                  >
                    {isClearing ? 'Tozalanmoqda...' : 'Keshni tozalash'}
                  </button>
                  <button 
                    onClick={() => setShowRestartModal(true)}
                    className="border-2 border-red-200 text-red-600 font-bold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-sm"
                  >
                    Tizimni qayta ishga tushirish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SAVE BUTTON */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 font-bold px-8 py-3 rounded-xl transition-all shadow-md ${
                saved ? 'bg-green-500 text-white' : 'bg-[#0052CC] text-white hover:bg-blue-700'
              }`}
            >
              {saved ? <><MdCheck size={20} /> Saqlandi!</> : <><MdSave size={20} /> Saqlash</>}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showClearModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ma'lumotlarni o'chirish</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Diqqat! Barcha bemorlar va bronlar bazadan butunlay o'chib ketadi. Bu amalni ortga qaytarib bo'lmaydi. Davom etasizmi?
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setShowClearModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Bekor qilish
              </button>
              <button 
                onClick={handleClearCache}
                className="px-6 py-2.5 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
              >
                Ha, o'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestartModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Tizimni qayta ishga tushirish</h3>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Tizimni qayta ishga tushirishni xohlaysizmi? Bu barcha mahalliy keshni tozalaydi va tizim asl holatiga qaytadi.
            </p>
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => setShowRestartModal(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Bekor qilish
              </button>
              <button 
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
              >
                Qayta ishga tushirish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restart Overlay */}
      {isRestarting && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
          <MdAutorenew className="text-[#0052CC] animate-spin mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tizim qayta ishga tushmoqda...</h2>
          <p className="text-gray-500">Iltimos, kuting.</p>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
