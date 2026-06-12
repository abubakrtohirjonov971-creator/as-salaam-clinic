import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PremiumDoctorCard from '../components/PremiumDoctorCard';
import { Helmet } from 'react-helmet-async';

const Doctors = () => {
  const doctors = useSelector((state) => state.doctors.items);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Malakali Shifokorlar | As-salaam Clinic Andijon</title>
        <meta name="description" content="Klinikamizdagi eng yaxshi shifokorlar: tajribali neyroxirurg, kardiolog, ortoped va pediatrlar xizmatingizda." />
        <meta name="keywords" content="eng yaxshi neyroxirurg Andijon, tajribali ortoped, kardiolog, pediatr, nevrolog, As-salaam shifokorlari" />
        <link rel="canonical" href="https://as-salaam-clinic.vercel.app/doctors" />
      </Helmet>
      <div className="container mx-auto px-4 md:px-6">
        
        {/* PAGE HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-3xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">{lang === 'ru' ? 'Наши квалифицированные врачи' : 'Bizning malakali shifokorlarimiz'}</h1>
          <p className="text-lg md:text-2xl text-gray-600">
            {lang === 'ru' ? 'Самые опытные специалисты города Андижана к вашим услугам.' : 'Andijon shahridagi eng tajribali mutaxassislar sizning xizmatingizda.'}
          </p>
        </div>
        
        {/* DOCTOR CARDS */}
        <div className="space-y-16">
          {doctors.map((doctor) => (
            <PremiumDoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
