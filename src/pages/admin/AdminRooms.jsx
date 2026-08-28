import React, { useState, useEffect } from 'react';
import { 
  MdFilterList, 
  MdDownload, 
  MdPerson, 
  MdAccessTime, 
  MdMoreVert,
  MdBed,
  MdMeetingRoom,
  MdScience,
  MdAdd,
  MdDelete,
  MdEdit,
  MdClose,
  MdSearch
} from 'react-icons/md';
import { supabase } from '../../lib/supabase';

// Helper component to render icons by name
const IconByName = ({ name, size, className }) => {
  switch (name) {
    case 'MdMeetingRoom': return <MdMeetingRoom size={size} className={className} />;
    case 'MdScience': return <MdScience size={size} className={className} />;
    case 'MdBed': 
    default: return <MdBed size={size} className={className} />;
  }
};

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Barchasi');
  const [isLoading, setIsLoading] = useState(true);

  // Stats computed dynamically from rooms state
  const totalRooms = rooms.length;
  const emptyRooms = rooms.filter(r => r.status === 'Bo\'sh').length;
  const busyRooms = rooms.filter(r => r.status === 'Band').length;
  const cleaningRooms = rooms.filter(r => r.status === 'Tozalanmoqda').length;

  const stats = [
    { label: 'UMUMIY XONALAR', value: totalRooms, valueColor: 'text-[#0052CC]' },
    { label: 'BЎШ XONALAR', value: emptyRooms, valueColor: 'text-green-500' },
    { label: 'BAND XONALAR', value: busyRooms, valueColor: 'text-red-500' },
    { label: 'TOZALANMOQDA', value: cleaningRooms, valueColor: 'text-orange-400' },
  ];

  // Modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch rooms on mount
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) throw error;
      if (data) setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const openEdit = (room) => {
    setEditData({ 
      ...room,
      status: room.status === "Bo'sh" ? 'Band' : room.status 
    });
    setIsEditOpen(true);
  };
  const closeEdit = () => {
    setIsEditOpen(false);
    setEditData(null);
  };
  
  const handlePriceChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setEditData({ ...editData, price: formattedValue });
  };

  const saveEdit = async () => {
    try {
      const originalRoom = rooms.find(r => r.id === editData.id);
      const oldPrice = originalRoom ? originalRoom.price : '';
      const newPrice = editData.price;

      const { error } = await supabase
        .from('rooms')
        .update(editData)
        .eq('id', editData.id);
        
      if (error) throw error;

      // Log payment to Kassa if price was newly added or changed
      if (newPrice && newPrice !== oldPrice) {
        const cleanedPrice = Number(newPrice.toString().replace(/\D/g, ''));
        if (cleanedPrice > 0) {
          await supabase.from('payments').insert([{
            patient_name: editData.patient || 'Noma\'lum',
            service: `Xona: ${editData.type} ${editData.number}`,
            amount: cleanedPrice
          }]);
        }
      }

      fetchRooms();
      closeEdit();
    } catch (error) {
      console.error('Error updating room:', error);
      alert(`Xatolik: ${error.message || 'Tahrirlashda xatolik yuz berdi.'}`);
    }
  };

  const openAdd = () => {
    setEditData({
      type: '',
      number: '',
      status: 'Band',
      patient: '',
      time: '',
      price: '',
      icon: 'MdBed',
      emptyicon: 'MdBed'
    });
    setIsAddOpen(true);
  };
  const closeAdd = () => {
    setIsAddOpen(false);
    setEditData(null);
  };

  const addRoom = async () => {
    try {
      const { error } = await supabase
        .from('rooms')
        .insert([editData]);
        
      if (error) throw error;
      fetchRooms();
      closeAdd();
    } catch (error) {
      console.error('Error adding room:', error);
      alert(`Xatolik: ${error.message || 'Qo\'shishda xatolik yuz berdi.'}`);
    }
  };

  const openDelete = (room) => {
    setDeleteTarget(room);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', deleteTarget.id);
        
      if (error) throw error;
      fetchRooms();
      setIsDeleteOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('O\'chirishda xatolik yuz berdi.');
    }
  };

  const filteredRooms = rooms.filter(r => {
    const matchesSearch = (r.number || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (r.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.patient || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeTab === 'Barchasi') return true;
    if (activeTab === 'Band') return r.status === 'Band';
    if (activeTab === 'Bo\'sh') return r.status === 'Bo\'sh';
    if (activeTab === 'Tozalanmoqda') return r.status === 'Tozalanmoqda';

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Xonalarni boshqarish</h2>
          <p className="text-gray-500">Klinikadagi mavjud xonalar va ularning hozirgi holati</p>
        </div>
        
        <button 
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#0052CC] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
        >
          <MdAdd size={20} />
          Xona qo'shish
        </button>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
            <h3 className={`text-4xl font-bold ${stat.valueColor}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="flex gap-8 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {['Barchasi', 'Band', 'Bo\'sh', 'Tozalanmoqda'].map(tab => (
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
              placeholder="Xona raqami yoki bemorni qidiring..." 
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

      {/* ROOMS GRID */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100 mb-12">
          Yuklanmoqda...
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredRooms.map((room) => (
          <div key={room.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[280px]">
            {/* Room Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{room.type}</p>
                <h3 className="text-xl font-bold text-gray-900">{room.number}</h3>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                room.status === 'Band' ? 'bg-red-50 text-red-600' : 
                room.status === 'Tozalanmoqda' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  room.status === 'Band' ? 'bg-red-500' : 
                  room.status === 'Tozalanmoqda' ? 'bg-orange-500' : 'bg-green-500'
                }`}></span>
                {room.status}
              </span>
            </div>

            {/* Room Content */}
            <div className="flex-1 flex flex-col justify-center">
              {room.status === 'Band' ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <MdPerson size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Bemor ismi</p>
                      <p className="font-medium text-gray-900">{room.patient}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <MdAccessTime size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Vaqti</p>
                      <p className="font-medium text-gray-900">{room.time}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full">
                  <IconByName name={room.emptyicon || 'MdBed'} size={40} className="text-gray-300 mb-2" />
                  <p className="text-gray-400 text-sm font-medium">Xona hozirda mavjud</p>
                </div>
              )}
            </div>

            {/* Room Footer */}
            <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                <button className="text-sm font-medium text-[#0052CC] hover:text-blue-800 transition-colors" onClick={() => openEdit(room)}>
                  {room.status === 'Band' ? 'Tafsilotlar' : 'Band qilish'}
                </button>
                <div className="flex gap-1">
                  <button className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors" onClick={() => openEdit(room)}>
                    <MdEdit size={18} />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" onClick={() => openDelete(room)}>
                    <MdDelete size={18} />
                  </button>
                </div>
            </div>
          </div>
        ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100 mb-12">
          Xonalar topilmadi.
        </div>
      )}

      {/* BOTTOM BUTTON */}
      <div className="flex justify-center">
        <button className="border border-[#0052CC] text-[#0052CC] font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
          Barcha xonalarni ko'rish
        </button>
      </div>

      {/* Edit / Add Modal */}
      {(isEditOpen || isAddOpen) && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{isEditOpen ? 'Xonani tahrirlash' : "Yangi xona qo'shish"}</h3>
              <button onClick={isEditOpen ? closeEdit : closeAdd} className="text-gray-400 hover:text-gray-600 transition-colors">
                <MdClose size={24} />
              </button>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); isEditOpen ? saveEdit() : addRoom(); }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xona turi</label>
                  <input required type="text" value={editData?.type || ''} onChange={e => setEditData({ ...editData, type: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="VIP PALATA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Xona raqami</label>
                  <input required type="text" value={editData?.number || ''} onChange={e => setEditData({ ...editData, number: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="Xona 101" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bemor ismi (agar band bo'lsa)</label>
                  <input type="text" value={editData?.patient || ''} onChange={e => setEditData({ ...editData, patient: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="Bemor ismi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kunlik narxi (so'm)</label>
                  <input type="text" value={editData?.price || ''} onChange={handlePriceChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="100.000" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vaqti</label>
                  <input type="text" value={editData?.time || ''} onChange={e => setEditData({ ...editData, time: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50" placeholder="14:00 - 18:00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={editData?.status || 'Band'} onChange={e => setEditData({ ...editData, status: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50 bg-white">
                    <option value="Band">Band</option>
                    <option value="Bo'sh">Bo'sh</option>
                    <option value="Tozalanmoqda">Tozalanmoqda</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ikonka (Bo'sh holatida)</label>
                <select value={editData?.emptyicon || 'MdBed'} onChange={e => setEditData({ ...editData, emptyicon: e.target.value })} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#0052CC]/50 bg-white">
                  <option value="MdBed">Krovat</option>
                  <option value="MdMeetingRoom">Eshik</option>
                  <option value="MdScience">Laboratoriya</option>
                </select>
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

      {/* Delete Confirmation */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDelete size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Haqiqatan ham o'chirasizmi?</h3>
            <p className="text-gray-500 mb-6">
              Siz <span className="font-bold text-gray-900">{deleteTarget?.type} {deleteTarget?.number}</span> xonasini o'chirib tashlamoqchisiz. Bu amalni ortga qaytarib bo'lmaydi.
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

export default AdminRooms;
