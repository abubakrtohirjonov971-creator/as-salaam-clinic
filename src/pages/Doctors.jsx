import React from 'react';
import { useSelector } from 'react-redux';
import PremiumDoctorCard from '../components/PremiumDoctorCard';

const Doctors = () => {
  const doctors = useSelector((state) => state.doctors.items);

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* PAGE HEADER */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">Bizning malakali shifokorlarimiz</h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Andijon shahridagi eng tajribali mutaxassislar sizning xizmatingizda.
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
