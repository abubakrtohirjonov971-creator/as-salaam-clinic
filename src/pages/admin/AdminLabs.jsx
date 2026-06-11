import React, { useState } from 'react';
import { 
  MdAdd,
  MdEdit, 
  MdDelete, 
  MdFilterList, 
  MdSearch,
  MdClose,
  MdScience,
  MdPending,
  MdCheckCircle,
  MdDownload
} from 'react-icons/md';

const initialLabs = [
  { id: 1, patient: 'Abdullayev Alisher', test: 'Qon tahlili (umumiy)', category: 'Gematologiya', doctor: 'Dr. Nazarov A.', date: '12 Okt, 2023', price: '45,000 sum', status: 'Tayyor' },
  { id: 2, patient: 'Sobirova Nigora', test: 'Siydik tahlili', category: 'Urologiya', doctor: 'Dr. Karimova S.', date: '12 Okt, 2023', price: '30,000 sum', status: 'Kutilmoqda' },
  { id: 3, patient: 'Olimov Jasur', test: 'EKG', category: 'Kardiologiya', doctor: 'Dr. Aliyev V.', date: '11 Okt, 2023', price: '60,000 sum', status: 'Tayyor' },
  { id: 4, patient: 'Umarova Malika', test: 'Qand miqdori (glyukoza)', category: 'Biokimyo', doctor: 'Dr. Raximov B.', date: '12 Okt, 2023', price: '25,000 sum', status: 'Jarayonda' },
  { id: 5, patient: 'Berdiyev Sardor', test: 'UZI (qorin bo\'shlig\'i)', category: 'Diagnostika', doctor: 'Dr. Nazarov A.', date: '10 Okt, 2023', price: '80,000 sum', status: 'Tayyor' },
  { id: 6, patient: 'Raximova Roziya', test: 'Rentgen (ko\'krak)', category: 'Radiologiya', doctor: 'Dr. Karimova S.', date: '13 Okt, 2023', price: '55,000 sum', status: 'Kutilmoqda' },
];

const categoryColors = {
  'Gematologiya': 'bg-red-50 text-red-600',
  'Urologiya': 'bg-blue-50 text-blue-600',
  'Kardiologiya': 'bg-pink-50 text-pink-600',
  'Biokimyo': 'bg-yellow-50 text-yellow-600',
  'Diagnostika': 'bg-purple-50 text-purple-600',
  'Radiologiya': 'bg-orange-50 text-orange-600',
};

const AdminLabs = () => {
  const [labs, setLabs] = useState(initialLabs);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLab, setCurrentLab] = useState(null);
  const [formData, setFormData] = useState({ patient: '', test: '', category: '', doctor: '', date: '', price: '', status: 'Kutilmoqda' });

  const handleOpenModal = (lab = null) => {
    if (lab) {
      setCurrentLab(lab);
      setFormData(lab);
    } else {
      setCurrentLab(null);
      setFormData({ patient: '', test: '', category: '', doctor: '', date: '', price: '', status: 'Kutilmoqda' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentLab) {
      setLabs(labs.map(l => l.id === currentLab.id ? { ...formData, id: currentLab.id } : l));
    } else {
      setLabs([{ ...formData, id: Date.now() }, ...labs]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setLabs(labs.filter(l => l.id !== currentLab.id));
    setIsDeleteModalOpen(false);
  };

  const filtered = labs.filter(l =>
    l.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.test.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'JAMI TAHLILLAR', value: labs.length, icon: <MdScience size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'TAYYOR', value: labs.filter(l => l.status === 'Tayyor').length, icon: <MdCheckCircle size={24} className="text-green-500" />, bg: 'bg-green-50' },
    { label: 'KUTILMOQDA', value: labs.filter(l => l.status === 'Kutilmoqda').length, icon: <MdPending size={24} className="text-yellow-500" />, bg: 'bg-yellow-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tahlillarni boshqarish</h2>
          <p className="text-gray-500">Laboratoriya natijalari va diagnostika tahlillarini kuzating</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium px-5 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            <MdDownload size={20} />
            Hisobot
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#0052CC] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
          >
            <MdAdd size={22} />
            Tahlil qo'shish
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              placeholder="Bemor yoki tahlil turini qidiring..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 text-sm rounded-xl pl-12 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border border-gray-200"
            />
          </div>
          <button className="flex items-center gap-2 text-gray-600 font-medium bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 w-full md:w-auto justify-center hover:text-primary transition-colors">
            <MdFilterList size={20} />Filtr
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bemor</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tahlil turi</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategoriya</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Shifokor</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sana / Narxi</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? filtered.map((lab) => {
                const initials = lab.patient.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const bgColors = ['bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-orange-100 text-orange-600', 'bg-pink-100 text-pink-600'];
                const colorIdx = lab.id % bgColors.length;
                return (
                  <tr key={lab.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${bgColors[colorIdx]}`}>
                          {initials}
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{lab.patient}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <MdScience size={16} className="text-gray-400" />
                        <span className="text-gray-900 font-medium text-sm">{lab.test}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[lab.category] || 'bg-gray-100 text-gray-600'}`}>
                        {lab.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-primary font-medium text-sm">{lab.doctor}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900 text-sm">{lab.date}</p>
                      <p className="text-gray-500 text-xs">{lab.price}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        lab.status === 'Tayyor' ? 'bg-green-50 text-green-600' :
                        lab.status === 'Jarayonda' ? 'bg-blue-50 text-blue-600' :
                        'bg-yellow-50 text-yellow-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          lab.status === 'Tayyor' ? 'bg-green-500' :
                          lab.status === 'Jarayonda' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}></span>
                        {lab.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleOpenModal(lab)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                          <MdEdit size={18} />
                        </button>
                        <button onClick={() => { setCurrentLab(lab); setIsDeleteModalOpen(true); }} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="7" className="py-12 text-center text-gray-500">Tahlillar topilmadi.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xl font-bold text-gray-900">{currentLab ? 'Tahlilni tahrirlash' : 'Yangi tahlil qo\'shish'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><MdClose size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bemor F.I.SH.</label>
                <input required type="text" value={formData.patient} onChange={e => setFormData({...formData, patient: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Abdullayev Alisher" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahlil turi</label>
                <input required type="text" value={formData.test} onChange={e => setFormData({...formData, test: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Qon tahlili (umumiy)" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
                  <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Gematologiya" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shifokor</label>
                  <input required type="text" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Dr. Nazarov A." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sana</label>
                  <input required type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="12 Okt, 2023" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Narxi</label>
                  <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="45,000 sum" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 bg-white">
                  <option value="Kutilmoqda">Kutilmoqda</option>
                  <option value="Jarayonda">Jarayonda</option>
                  <option value="Tayyor">Tayyor</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">Bekor qilish</button>
                <button type="submit" className="flex-1 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDelete size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Haqiqatan ham o'chirasizmi?</h3>
            <p className="text-gray-500 mb-6"><span className="font-bold text-gray-900">{currentLab?.test}</span> tahlili o'chirib tashlanadi.</p>
            <div className="flex gap-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">Yo'q</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-600 transition-colors">O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLabs;
