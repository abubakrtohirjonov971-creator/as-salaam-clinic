import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addDoctorAsync, updateDoctorAsync, removeDoctorAsync } from '../../slices/doctorsSlice';
import { 
  MdPersonAdd, 
  MdEdit, 
  MdDelete, 
  MdFilterList, 
  MdSearch,
  MdClose,
  MdLocalHospital,
  MdWork,
  MdSchool
} from 'react-icons/md';

const AdminDoctors = () => {
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.doctors.items);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ 
    id: '', name: '', specialty: '', experience: '', 
    about: '', education: '', methods: '', image: '' 
  });

  // Handlers
  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setCurrentDoctor(doctor);
      setFormData(doctor);
    } else {
      setCurrentDoctor(null);
      setFormData({ 
        id: '', name: '', specialty: '', experience: '', 
        about: '', education: '', methods: '', image: '' 
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentDoctor(null);
  };

  const handleOpenDeleteModal = (doctor) => {
    setCurrentDoctor(doctor);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentDoctor(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentDoctor) {
      // Edit
      dispatch(updateDoctorAsync({ ...formData }));
    } else {
      // Add
      const newDoctor = { 
        ...formData, 
        id: formData.id || Date.now().toString(), // Generate ID if not provided
        diseases: [] // Default empty array for diseases
      };
      dispatch(addDoctorAsync(newDoctor));
    }
    handleCloseModal();
  };

  const handleDelete = () => {
    dispatch(removeDoctorAsync(currentDoctor.id));
    handleCloseDeleteModal();
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const stats = [
    { label: 'JAMI SHIFOKORLAR', value: doctors.length, icon: <MdLocalHospital size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'OLIY TOIFA', value: '7', icon: <MdSchool size={24} className="text-green-500" />, bg: 'bg-green-50' },
    { label: 'YANGI QO\'SHILGANLAR', value: '2', icon: <MdWork size={24} className="text-purple-500" />, bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shifokorlarni boshqarish</h2>
          <p className="text-gray-500">Klinika mutaxassislari ro'yxati va ularning profil ma'lumotlari</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#0052CC] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
        >
          <MdPersonAdd size={20} />
          Shifokor qo'shish
        </button>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-2xl ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MdSearch className="text-gray-400" size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Shifokor ismi yoki mutaxassisligini qidiring..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 text-gray-800 text-sm rounded-xl pl-12 pr-4 py-2.5 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border border-gray-200"
            />
          </div>
          <button className="flex items-center gap-2 text-gray-600 font-medium hover:text-primary transition-colors bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200 w-full md:w-auto justify-center">
            <MdFilterList size={20} />
            Filtr
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tl-xl">F.I.SH. va Mutaxassisligi</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tajribasi</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ta'limi</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right rounded-tr-xl">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDoctors.length > 0 ? filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      {/* Kichraytirilgan rasm */}
                      <img 
                        src={doctor.image || 'https://via.placeholder.com/150'} 
                        alt={doctor.name} 
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{doctor.name}</p>
                        <p className="text-primary text-xs font-bold mt-0.5">{doctor.specialty}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {doctor.experience}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm max-w-[300px] truncate" title={doctor.education}>
                    {doctor.education}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(doctor)}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteModal(doctor)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-500">
                    Shifokorlar topilmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="text-xl font-bold text-gray-900">{currentDoctor ? 'Shifokorni tahrirlash' : 'Yangi shifokor qo\'shish'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <MdClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">F.I.SH.</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Haydarov Erkinbek" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mutaxassisligi</label>
                  <input required type="text" name="specialty" value={formData.specialty} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="NEYROXIRURG" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tajribasi</label>
                  <input required type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="15 yillik ish tajribasi" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rasm URL/Yo'li</label>
                  <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Rasm havolasi..." />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qisqacha ma'lumot (About)</label>
                <textarea rows="3" name="about" value={formData.about} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Shifokor haqida..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ta'lim</label>
                <textarea rows="2" name="education" value={formData.education} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="O'qigan joylari..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Davolash usullari</label>
                <textarea rows="2" name="methods" value={formData.methods} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Foydalanadigan usullari..." />
              </div>

              <div className="flex gap-4 pt-4 mt-6 border-t border-gray-100">
                <button type="button" onClick={handleCloseModal} className="flex-1 bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                  Bekor qilish
                </button>
                <button type="submit" className="flex-1 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdDelete size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Haqiqatan ham o'chirasizmi?</h3>
            <p className="text-gray-500 mb-6">
              Siz <span className="font-bold text-gray-900">{currentDoctor?.name}</span> haqidagi barcha ma'lumotlarni o'chirib tashlamoqchisiz. Bu amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-4">
              <button onClick={handleCloseDeleteModal} className="flex-1 bg-gray-100 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors">
                Yo'q
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-red-600 transition-colors shadow-md">
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDoctors;
