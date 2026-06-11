import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { FaCheckCircle, FaPhoneAlt, FaCalendarAlt } from 'react-icons/fa';
import Button from '../components/Button';
import ServiceCard from '../components/ServiceCard';
import DoctorCard from '../components/DoctorCard';

const Home = () => {
  const { t } = useTranslation();
  const services = useSelector((state) => state.services.items);
  const doctors = useSelector((state) => state.doctors.items);

  return (
    <div className="flex flex-col">
      <Helmet>
        <title>As-salaam Clinic — Andijondagi zamonaviy tibbiyot markazi</title>
        <meta name="description" content="Kardiologiya, Nevrologiya, Urologiya va zamonaviy labaratoriya xizmatlari. Andijon shahridagi ishonchli klinikangiz." />
      </Helmet>

      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000"
            alt="Hospital"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 text-white">
          <div className="max-w-2xl">
            <span className="inline-block py-1 px-4 bg-primary/20 border border-primary/30 rounded-full text-primary-light font-bold mb-6 animate-pulse">
              {t('hero.badge')}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              {t('hero.title1')} <span className="text-primary-light">{t('hero.title2')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              {t('hero.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button to="/booking" className="px-8 py-4 text-lg">{t('hero.btn_booking')}</Button>
              <Button to="/about" variant="outline" className="px-8 py-4 text-lg !border-white !text-white hover:!bg-white hover:!text-primary">
                {t('hero.btn_more')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="py-24 bg-white" id="about">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <div className="inline-block py-1 px-4 bg-blue-50 text-primary font-bold rounded-lg">{t('about.badge')}</div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">{t('about.title')}</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{t('about.desc')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[t('about.feat1'), t('about.feat2'), t('about.feat3'), t('about.feat4')].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <FaCheckCircle className="text-primary text-xl flex-shrink-0" />
                    <span className="font-semibold text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl -z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000"
                  alt="Doctor"
                  className="rounded-3xl shadow-2xl relative z-10 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">{t('services.title')}</h2>
            <p className="text-gray-600">{t('services.desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Button to="/services" className="px-8 py-4 text-lg">
              {t('services.all')}
            </Button>
          </div>
        </div>
      </section>

      {/* 5. METHODS SECTION */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl font-bold mb-16 text-center">{t('methods.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: t('methods.diag_title'), desc: t('methods.diag_desc') },
              { title: t('methods.therapy_title'), desc: t('methods.therapy_desc') },
              { title: t('methods.rehab_title'), desc: t('methods.rehab_desc') },
            ].map((method, i) => (
              <div key={i} className="text-center p-8 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
                <h3 className="text-2xl font-bold mb-4">{method.title}</h3>
                <p className="text-blue-100">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DOCTORS SECTION */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('doctors.title')}</h2>
            <p className="text-gray-600">{t('doctors.desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. CTA SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 max-w-xl text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">{t('cta.title')}</h2>
              <p className="text-xl text-blue-100">{t('cta.desc')}</p>
            </div>
            <div className="relative z-10 flex flex-col gap-6 items-center">
              <Button to="/booking" variant="outline" className="!bg-white !text-primary hover:!bg-blue-50 border-none px-10 py-5 text-xl font-bold">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt />
                  {t('cta.btn')}
                </div>
              </Button>
              <div className="flex items-center gap-4 text-2xl font-bold">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <FaPhoneAlt size={20} />
                </div>
                <span>+998 90 544 77 07</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
