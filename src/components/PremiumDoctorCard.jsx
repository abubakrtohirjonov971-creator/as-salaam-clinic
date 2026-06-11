import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaCalendarAlt, FaCheckCircle, FaStar, FaUserMd } from 'react-icons/fa';

const PremiumDoctorCard = ({ doctor }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 p-8 md:p-12 group mb-16">
      {/* TOP SECTION: LEFT & RIGHT SPLIT */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 justify-between">
        
        {/* LEFT: Image, Name, Badge, Experience, Button */}
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start lg:w-2/3">
          {/* Large Doctor Image */}
          <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 relative rounded-3xl overflow-hidden shadow-lg border-4 border-white">
            <img 
              src={doctor.image} 
              alt={doctor.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
          
          <div className="flex flex-col justify-center h-full text-center sm:text-left py-2">
            {/* Specialty badge */}
            <div className="inline-block bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4 mx-auto sm:mx-0 w-max">
              {doctor.specialty}
            </div>
            {/* Name */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{doctor.name}</h2>
            {/* Experience */}
            <div className="inline-flex items-center justify-center sm:justify-start gap-2 text-primary font-bold text-lg mb-8">
              <FaUserMd size={22} />
              {doctor.experience}
            </div>
            {/* Appointment button */}
            <Link 
              to="/booking" 
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-md hover:-translate-y-1 active:scale-95 text-lg"
            >
              Qabulga yozilish
            </Link>
          </div>
        </div>

        {/* RIGHT: Blue working hours card & Phone */}
        <div className="lg:w-1/3 flex lg:justify-end w-full">
          <div className="bg-blue-50 p-8 rounded-3xl w-full lg:w-80 border border-blue-100 flex flex-col justify-center h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-blue-200 pb-4">Ish vaqti va Kontakt</h3>
            <div className="flex items-center gap-4 mb-6 text-gray-700">
              <div className="bg-white p-3 rounded-xl shadow-sm text-primary">
                <FaCalendarAlt size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Dushanba - Shanba</p>
                <p className="font-bold text-gray-900">09:00 - 21:00</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-800 pt-6 border-t border-blue-200">
              <div className="bg-white p-3 rounded-xl shadow-sm text-primary">
                <FaPhoneAlt size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Aloqa markazi</p>
                <p className="font-bold text-xl text-primary">+998 90 544 77 07</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="pt-12 mt-12 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Info & Education */}
        <div className="space-y-8 lg:col-span-1">
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-xl flex items-center gap-3">
              <span className="w-2 h-6 bg-primary rounded-full"></span>
              Doctor haqida
            </h4>
            <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-xl flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-300 rounded-full"></span>
              Ta’lim va tajriba
            </h4>
            <p className="text-gray-600 leading-relaxed">{doctor.education}</p>
          </div>
        </div>

        {/* Methods & Diseases */}
        <div className="space-y-8 lg:col-span-1">
          <div>
            <h4 className="font-bold text-gray-900 mb-3 text-xl flex items-center gap-3">
              <span className="w-2 h-6 bg-blue-400 rounded-full"></span>
              Davolash usullari
            </h4>
            <p className="text-gray-600 leading-relaxed">{doctor.methods}</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-3">
              <span className="w-2 h-6 bg-primary rounded-full"></span>
              Qaysi kasalliklarni davolaydi
            </h4>
            <ul className="space-y-3">
              {doctor.diseases.map((d, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <FaCheckCircle className="text-primary flex-shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reviews */}
        <div className="lg:col-span-1 flex flex-col">
          <h4 className="font-bold text-gray-900 mb-6 text-xl flex items-center gap-3">
            <span className="w-2 h-6 bg-yellow-400 rounded-full"></span>
            Bemor fikrlari
          </h4>
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex-grow flex flex-col justify-center items-center text-center">
            <div className="flex text-yellow-400 text-2xl mb-4">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
            </div>
            <p className="text-3xl font-black text-gray-900 mb-2">4.9<span className="text-xl text-gray-500 font-medium">/5</span></p>
            <p className="text-gray-600 font-medium mb-6">150+ ijobiy sharhlar</p>
            
            <div className="flex -space-x-4">
              <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Bemor" />
              <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" alt="Bemor" />
              <img className="w-12 h-12 rounded-full border-4 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Bemor" />
              <div className="w-12 h-12 rounded-full border-4 border-white bg-white flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                +147
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PremiumDoctorCard;
