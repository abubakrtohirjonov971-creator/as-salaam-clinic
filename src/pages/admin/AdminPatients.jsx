import React, { useState, useEffect } from 'react';
import { 
  MdPersonAdd, 
  MdEdit, 
  MdDelete, 
  MdFilterList, 
  MdSearch,
  MdClose,
  MdHealing,
  MdLocalHospital,
  MdCheckCircle
} from 'react-icons/md';
import { supabase } from '../../lib/supabase';

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', phone: '', age: '', address: '', diagnosis: '', price: '', status: 'Davolanmoqda' });

  // Fetch patients on mount + real-time subscription
  useEffect(() => {
    fetchPatients();

    // Real-time: auto-refresh when patients table changes
    const channel = supabase
      .channel('patients-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, () => {
        fetchPatients();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handlers
  const handleOpenModal = (patient = null) => {
    if (patient) {
      setCurrentPatient(patient);
      setFormData({
        name: patient.name || '',
        phone: patient.phone || '',
        age: patient.age || '',
        address: patient.address || '',
        diagnosis: patient.diagnosis || '',
        price: patient.price || '',
        status: patient.status || 'Davolanmoqda'
      });
    } else {
      setCurrentPatient(null);
      setFormData({ name: '', phone: '', age: '', address: '', diagnosis: '', price: '', status: 'Davolanmoqda' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPatient(null);
  };

  const handleOpenDeleteModal = (patient) => {
    setCurrentPatient(patient);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCurrentPatient(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
      const rawValue = value.replace(/\D/g, '');
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentPatient) {
        // Edit
        const { error } = await supabase
          .from('patients')
          .update(formData)
          .eq('id', currentPatient.id);
          
        if (error) throw error;
      } else {
        // Add
        const { error } = await supabase
          .from('patients')
          .insert([formData]);
          
        if (error) throw error;
      }

      // Log payment to Kassa if price was newly added or changed
      const oldPrice = currentPatient ? currentPatient.price : '';
      const newPrice = formData.price;
      
      if (newPrice && newPrice !== oldPrice) {
        const cleanedPrice = Number(newPrice.toString().replace(/\D/g, ''));
        if (cleanedPrice > 0) {
          await supabase.from('payments').insert([{
            patient_name: formData.name,
            service: 'Bemor to\'lovi',
            amount: cleanedPrice
          }]);
        }
      }

      // Refresh list
      fetchPatients();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving patient:', error);
      if (error.message && error.message.includes('price')) {
        alert("DIQQAT: Supabase bazangizdagi 'patients' jadvalida 'price' (to'lov) ustuni yo'q!\n\nIltimos, Supabase'ga kirib 'patients' jadvaliga 'price' nomli (type: numeric yoki text) ustun qo'shing.");
      } else {
        alert(`Xatolik: ${error.message || 'Saqlashda xatolik yuz berdi.'}`);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', currentPatient.id);
        
      if (error) throw error;
      fetchPatients();
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('O\'chirishda xatolik yuz berdi.');
    }
  };

  const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Stats
  const stats = [
    { label: 'JAMI BEMORLAR', value: patients.length, icon: <MdLocalHospital size={24} className="text-blue-500" />, bg: 'bg-blue-50' },
    { label: 'KUTILMOQDA', value: patients.filter(p => p.status === 'Kutilmoqda').length, icon: <MdHealing size={24} className="text-yellow-500" />, bg: 'bg-yellow-50' },
    { label: 'DAVOLANMOQDA', value: patients.filter(p => p.status === 'Davolanmoqda').length, icon: <MdHealing size={24} className="text-blue-400" />, bg: 'bg-blue-50' },
    { label: 'TUZALGANLAR', value: patients.filter(p => p.status === 'Tuzalgan').length, icon: <MdCheckCircle size={24} className="text-green-500" />, bg: 'bg-green-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bemorlarni boshqarish</h2>
          <p className="text-gray-500">Klinikadagi barcha bemorlar ro'yxati va ularning holati</p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#0052CC] text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-md"
        >
          <MdPersonAdd size={20} />
          Bemor qo'shish
        </button>
      </div>

      {/* STATS SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
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
              placeholder="Bemor ismini qidiring..." 
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
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tl-xl">F.I.SH.</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Telefon / Yosh</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Manzil</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tashxis</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">To'lov</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right rounded-tr-xl">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 font-medium text-gray-900">{patient.name}</td>
                  <td className="py-4 px-4">
                    <p className="text-gray-900 font-medium">{patient.phone}</p>
                    <p className="text-gray-500 text-xs">{patient.age} yosh</p>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">{patient.address}</td>
                  <td className="py-4 px-4 text-gray-900 font-medium text-sm">{patient.diagnosis}</td>
                  <td className="py-4 px-4 text-gray-900 font-bold text-sm">{patient.price ? patient.price.toString().replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " so'm" : "—"}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      patient.status === 'Tuzalgan' ? 'bg-green-50 text-green-600' :
                      patient.status === 'Davolanmoqda' ? 'bg-blue-50 text-blue-600' :
                      'bg-yellow-50 text-yellow-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        patient.status === 'Tuzalgan' ? 'bg-green-500' :
                        patient.status === 'Davolanmoqda' ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}></span>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(patient)}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteModal(patient)}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    Bemorlar topilmadi.
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
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{currentPatient ? 'Bemorni tahrirlash' : 'Yangi bemor qo\'shish'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <MdClose size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">F.I.SH.</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Abdullayev Alisher" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input required type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="+998 90 123 45 67" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Yosh</label>
                  <input required type="number" name="age" value={formData.age} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="45" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Toshkent shahri..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tashxis (Kasallik tarixi)</label>
                <input required type="text" name="diagnosis" value={formData.diagnosis} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="Masalan: Surunkali bronxit" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To'lov summasi (so'm)</label>
                <input type="text" name="price" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50" placeholder="100.000" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/50 bg-white">
                  <option value="Davolanmoqda">Davolanmoqda</option>
                  <option value="Kutilmoqda">Kutilmoqda</option>
                  <option value="Tuzalgan">Tuzalgan</option>
                </select>
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
              Siz <span className="font-bold text-gray-900">{currentPatient?.name}</span> haqidagi barcha ma'lumotlarni o'chirib tashlamoqchisiz. Bu amalni ortga qaytarib bo'lmaydi.
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

export default AdminPatients;
