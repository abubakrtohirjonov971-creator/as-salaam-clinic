import React, { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("So‘rov yuborildi! Tez orada siz bilan bog'lanamiz.");
    setFormData({ name: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Biz bilan bog'lanish</h1>
          <p className="text-xl text-gray-600">Savollaringiz bormi? Bizga xabar qoldiring yoki qo'ng'iroq qiling.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {[
              { icon: FaPhoneAlt, title: 'Telefon', value: '+998 90 544 77 07', desc: 'Dush-Shan, 08:00 - 20:00' },
              { icon: FaEnvelope, title: 'Email', value: 'info@assalom.uz', desc: 'Istalgan vaqtda yozing' },
              { icon: FaMapMarkerAlt, title: 'Manzil', value: 'Andijon shahar, ADTI qarshisida ',  },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm flex items-start gap-5 border border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                  <p className="text-primary font-semibold mb-1">{item.value}</p>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-8 text-gray-900">Qabulga yozilish</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-gray-700 ml-1">Ismingiz</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Masalan: Alisher Karimov"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-bold text-gray-700 ml-1">Telefon raqamingiz</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-gray-700 ml-1">Xabaringiz (ixtiyoriy)</label>
                  <textarea
                    id="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Savolingiz yoki shikoyatingiz..."
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-primary/20 group active:scale-[0.98]"
                >
                  <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Xabarni yuborish
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
