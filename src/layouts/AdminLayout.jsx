import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  MdDashboard, 
  MdPeople, 
  MdEventNote, 
  MdLocalHospital, 
  MdMeetingRoom, 
  MdHealing, 
  MdScience, 
  MdSettings,
  MdNotifications,
  MdHelpOutline,
  MdSearch,
  MdClose,
  MdLogout,
  MdAccountBalanceWallet
} from 'react-icons/md';
import { supabase } from '../lib/supabase';

const AdminLayout = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [pendingBookings, setPendingBookings] = useState([]);
  
  const profile = useSelector(state => state.settings.profile);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  // Fetch pending (Kutilmoqda) bookings count
  const fetchPendingBookings = async () => {
    const { data, count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact' })
      .eq('status', 'Kutilmoqda')
      .order('created_at', { ascending: false })
      .limit(10);
    
    setPendingCount(count || 0);
    setPendingBookings(data || []);
  };

  useEffect(() => {
    fetchPendingBookings();

    // Real-time: update badge when bookings change
    const channel = supabase
      .channel('layout-bookings-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        fetchPendingBookings();
      })
      .subscribe();

    // Polling fallback: refresh every 10 seconds
    const interval = setInterval(fetchPendingBookings, 10000);

    // Listen for manual trigger from other components
    const handleBookingUpdated = () => fetchPendingBookings();
    window.addEventListener('booking-updated', handleBookingUpdated);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      window.removeEventListener('booking-updated', handleBookingUpdated);
    };
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <MdDashboard size={22} />, path: '/admin' },
    { name: 'Bemorlar', icon: <MdPeople size={22} />, path: '/admin/patients' },
    { name: 'Bronlar', icon: <MdEventNote size={22} />, path: '/admin/bookings', badge: pendingCount },
    { name: 'Shifokorlar', icon: <MdLocalHospital size={22} />, path: '/admin/doctors' },
    { name: 'Xonalar', icon: <MdMeetingRoom size={22} />, path: '/admin/rooms' },
    { name: 'Kassa', icon: <MdAccountBalanceWallet size={22} />, path: '/admin/finance' },
    { name: 'Davolash', icon: <MdHealing size={22} />, path: '/admin/treatments' },
    { name: 'Tahlillar', icon: <MdScience size={22} />, path: '/admin/labs' },
    { name: 'Sozlamalar', icon: <MdSettings size={22} />, path: '/admin/settings' },
  ];

  return (
    <div className="flex h-screen bg-[#F5F7FB] font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-xl">
              <MdLocalHospital size={24} />
            </div>
            <div>
              <h1 className="font-bold text-primary text-lg leading-tight">As-salam Clinic</h1>
              <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => 
                `flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-primary' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <span className="relative">
                {item.icon}
              </span>
              <span className="flex-1">{item.name}</span>
              {item.badge > 0 && (
                <span className="min-w-[20px] h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer - pending summary */}
        {pendingCount > 0 && (
          <div className="mx-4 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-xs font-bold text-yellow-700">
              ⏳ {pendingCount} ta yangi bron kutilmoqda
            </p>
            <Link to="/admin/bookings" className="text-xs text-yellow-600 underline">
              Ko'rish →
            </Link>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 ml-64 flex flex-col h-screen">
        
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          {/* Search */}
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Bemorlarni qidirish..." 
              className="w-full bg-gray-100/70 text-gray-800 text-sm rounded-xl pl-12 pr-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Right Area */}
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="relative text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MdNotifications size={24} />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 animate-pulse">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {showNotifPanel && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h4 className="font-bold text-gray-900 text-sm">Yangi bronlar</h4>
                    <button onClick={() => setShowNotifPanel(false)} className="text-gray-400 hover:text-gray-600">
                      <MdClose size={18} />
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {pendingBookings.length > 0 ? pendingBookings.map(b => (
                      <Link
                        key={b.id}
                        to="/admin/bookings"
                        onClick={() => setShowNotifPanel(false)}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${b.color || 'bg-blue-100 text-blue-600'}`}>
                          {b.initials || 'N'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{b.name}</p>
                          <p className="text-xs text-gray-500">{b.doctor} • {b.date} {b.time}</p>
                        </div>
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full flex-shrink-0">
                          Yangi
                        </span>
                      </Link>
                    )) : (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        Yangi bronlar yo'q
                      </div>
                    )}
                  </div>
                  {pendingCount > 0 && (
                    <div className="p-3 border-t border-gray-100">
                      <Link
                        to="/admin/bookings"
                        onClick={() => setShowNotifPanel(false)}
                        className="block w-full text-center text-sm font-bold text-primary hover:text-blue-700"
                      >
                        Barchasini ko'rish ({pendingCount} ta) →
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <MdHelpOutline size={24} />
            </button>
            <div className="w-px h-8 bg-gray-200"></div>
            <Link to="/admin/settings" className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{profile.name}</p>
                <p className="text-xs text-gray-500">{profile.role}</p>
              </div>
              <img 
                src={profile.avatar} 
                alt={profile.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all"
              />
            </Link>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors ml-2" title="Tizimdan chiqish">
              <MdLogout size={24} />
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      {/* Backdrop for notification panel */}
      {showNotifPanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifPanel(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
