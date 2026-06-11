import React from 'react';
import { useSelector } from 'react-redux';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const services = useSelector((state) => state.services.items);

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Bizning xizmatlar</h1>
          <p className="text-xl text-gray-600">
            Klinikamizda taqdim etiladigan yuqori sifatli tibbiy xizmatlar bilan tanishing.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
