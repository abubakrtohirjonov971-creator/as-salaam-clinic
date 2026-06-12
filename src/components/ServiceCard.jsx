import React from 'react';
import { 
  FaBone, FaBrain, FaProcedures, FaArrowRight, FaStethoscope,
  FaNotesMedical, FaHeartbeat, FaChild, FaWheelchair, FaSpa
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tDB } from '../utils/translateDB';

const iconMap = {
  FaBone: FaBone,
  FaBrain: FaBrain,
  FaProcedures: FaProcedures,
  FaNotesMedical: FaNotesMedical,
  FaHeartbeat: FaHeartbeat,
  FaChild: FaChild,
  FaStethoscope: FaStethoscope,
  FaWheelchair: FaWheelchair,
  FaSpa: FaSpa,
};

const ServiceCard = ({ service }) => {
  const Icon = iconMap[service.icon] || FaStethoscope;
  const { i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="card group">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={service.image} 
          alt={tDB(service.title, lang)} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg">
          <Icon size={24} />
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">{tDB(service.title, lang)}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed line-clamp-2">
          {tDB(service.desc, lang)}
        </p>
        <Link 
          to={`/services/${service.id}`} 
          className="inline-flex items-center gap-2 text-primary font-bold group/link hover:underline"
        >
          {lang === 'ru' ? 'Подробнее' : 'Batafsil'}
          <FaArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
