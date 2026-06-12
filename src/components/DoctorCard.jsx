import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tDB } from '../utils/translateDB';

const DoctorCard = ({ doctor }) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Link to={`/doctors/${doctor.id}`} className="group text-center block">
      <div className="relative mb-6 mx-auto w-48 h-48 md:w-56 md:h-56">
        {/* Background decorative circles */}
        <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500"></div>
        <div className="absolute inset-0 border-2 border-dashed border-primary/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
        
        {/* Doctor Image */}
        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl">
          <img 
            src={doctor.image} 
            alt={doctor.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{doctor.name}</h3>
      <p className="text-primary font-medium">{tDB(doctor.specialty || doctor.role, lang)}</p>
    </Link>
  );
};

export default DoctorCard;
