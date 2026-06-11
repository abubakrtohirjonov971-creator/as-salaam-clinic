import React, { useState } from 'react';
import { 
  MdAdd,
  MdEdit, 
  MdDelete, 
  MdFilterList, 
  MdSearch,
  MdClose,
  MdHealing,
  MdMedicalServices,
  MdCheckCircle,
  MdMoreVert
} from 'react-icons/md';

const initialTreatments = [
  { id: 1, name: 'Arterial gipertenziya', category: 'Kardiologiya', doctor: 'Dr. Nazarov A.', duration: '30 kun', price: '450,000 sum', status: 'Faol', patients: 12 },
  { id: 2, name: 'Surunkali bronxit', category: 'Pulmonologiya', doctor: 'Dr. Karimova S.', duration: '14 kun', price: '280,000 sum', status: 'Faol', patients: 8 },
  { id: 3, name: 'Osteoxondroz', category: 'Nevrologiya', doctor: 'Dr. Aliyev V.', duration: '21 kun', price: '320,000 sum', status: 'Faol', patients: 15 },
  { id: 4, name: 'Qandli diabet', category: 'Endokrinologiya', doctor: 'Dr. Umarova M.', duration: '60 kun', price: '600,000 sum', status: 'Tugatilgan', patients: 5 },
  { id: 5, name: 'Migren', category: 'Nevrologiya', doctor: 'Dr. Aliyev V.', duration: '10 kun', price: '180,000 sum', status: 'Faol', patients: 9 },
  { id: 6, name: 'Gastrit', category: 'Gastroenterologiya', doctor: 'Dr. Raximov B.', duration: '15 kun', price: '210,000 sum', status: 'Tugatilgan', patients: 7 },
];

const AdminTreatments = () => {
  const [treatments, setTreatments] = useState(initialTreatments);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTreatment, setCurrentTreatment] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', doctor: '', duration: '', price: '', status: 'Faol', patients: 0 });

  const handleOpenModal = (treatment = null) => {
    if (treatment) {
      setCurrentTreatment(treatment);
      setFormData(treatment);
    } else {
      setCurrentTreatment(null);
      setFormData({ name: '', category: '', doctor: '', duration: '', price: '', status: 'Faol', patients: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTreatment) {
      setTreatments(treatments.map(t => t.id === currentTreatment.id ? { ...formData, id: currentTreatment.id } : t));
    } else {
      setTreatments([{ ...formData, id: Date.now() }, ...treatments]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setTreatments(treatments.filter(t => t.id !== currentTreatment.id));
    setIsDeleteModalOpen(false);
  };

  const filtered = treatments.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'JAMI DAVOLASHLAR', value: treatments.length, icon: <MdHealing size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'FAOL', value: treatments.filter(t => t.status === 'Faol').length, icon: <MdMedicalServices size={24} className="text-green-500" />, bg: 'bg-green-50' },
    { label: 'TUGATILGAN', value: treatments.filter(t => t.status === 'Tugatilgan').length, icon: <MdCheckCircle size={24} className="text-gray-400" />, bg: 'bg-gray-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Davolashni boshqarish</h2>
          <p className="text-gray-500">Klinikadagi barcha davolash kurslari va ularning holati</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#0052CC] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
        >
          <MdAdd size={22} />
          Davolash qo'shish
        </button>
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
              placeholder="Davolash yoki kategoriya bo'yicha qidiring..."
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
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Davolash nomi</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategoriya</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Shifokor</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Muddati / Narxi</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bemorlar</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                        <MdHealing size={18} className="text-blue-500" />
                      </div>
                      <span className="font-medium text-gray-900">{t.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">{t.category}</span>
                  </td>
                  <td className="py-4 px-4 text-primary font-medium text-sm">{t.doctor}</td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{t.duration}</p>
                    <p className="text-gray-500 text-xs">{t.price}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {t.patients} bemor
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      t.status === 'Faol' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Faol' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(t)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                        <MdEdit size={18} />
                      </button>
                      <button onClick={() => { setCurrentTreatment(t); setIsDeleteModalOpen(true); }} className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors">
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="py-12 text-center text-gray-500">Davolashlar topilmadi.</td></tr>
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
              <h3 className="text-xl font-bold text-gray-900">{currentTreatment ? 'Davolashni tahrirlash' : 'Yangi davolash qo\'shish'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><MdClose size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Davolash nomi</label>
                <input required type="text" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Masalan: Arterial gipertenziya" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategoriya</label>
                  <input required type="text" name="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Kardiologiya" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shifokor</label>
                  <input required type="text" name="doctor" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Dr. Nazarov A." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Muddati</label>
                  <input required type="text" name="duration" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="30 kun" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Narxi</label>
                  <input required type="text" name="price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="450,000 sum" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 bg-white">
                  <option value="Faol">Faol</option>
                  <option value="Tugatilgan">Tugatilgan</option>
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
            <p className="text-gray-500 mb-6"><span className="font-bold text-gray-900">{currentTreatment?.name}</span> davolash kursi o'chirib tashlanadi.</p>
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

export default AdminTreatments;
