import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPlay, FaMicroscope, FaUserMd, FaShieldAlt, FaClock } from 'react-icons/fa';

const galleryImages = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000',
];

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { value: '10+', label: t('about_page.stat1') },
    { value: '50+', label: t('about_page.stat2') },
    { value: '1000+', label: t('about_page.stat3') },
    { value: '24/7', label: t('about_page.stat4') },
  ];

  const features = [
    { icon: FaMicroscope, title: t('about_page.feat1_title'), desc: t('about_page.feat1_desc') },
    { icon: FaUserMd,    title: t('about_page.feat2_title'), desc: t('about_page.feat2_desc') },
    { icon: FaShieldAlt, title: t('about_page.feat3_title'), desc: t('about_page.feat3_desc') },
    { icon: FaClock,     title: t('about_page.feat4_title'), desc: t('about_page.feat4_desc') },
  ];

  return (
    <div className="bg-white min-h-screen">

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gray-900">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000"
            alt="Medical Clinic Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-blue-900/40"></div>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block bg-white text-primary text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-6 shadow-sm border border-blue-100"
            >
              {t('about_page.badge')}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight tracking-tight"
            >
              {t('about_page.title').split('—')[0]}—{' '}
              <span className="text-blue-400">{t('about_page.title').split('—')[1]}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed"
            >
              {t('about_page.desc')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link to="/booking" className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1 text-center text-lg">
                {t('about_page.btn_contact')}
              </Link>
              <button className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-10 rounded-2xl transition-all shadow-md border border-gray-100 flex items-center justify-center gap-3 hover:-translate-y-1 text-lg">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                  <FaPlay size={12} />
                </div>
                {t('about_page.btn_video')}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-12 bg-white border-b border-gray-100 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-50 hover:-translate-y-1 transition-transform h-full flex flex-col justify-center"
              >
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">{stat.value}</div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HISTORY SECTION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{t('about_page.history_title')}</h2>
                <p className="text-lg text-gray-600 leading-relaxed">{t('about_page.history_desc')}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-blue-50 p-8 md:p-10 rounded-3xl border border-blue-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <span className="w-2 h-8 bg-primary rounded-full"></span>
                  {t('about_page.mission_title')}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed font-medium">{t('about_page.mission_desc')}</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 w-full relative"
            >
              <div className="absolute inset-0 bg-primary/5 transform translate-x-4 translate-y-4 rounded-[2.5rem] -z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&q=80&w=1000"
                alt="Modern Clinic"
                className="w-full h-auto rounded-[2.5rem] shadow-2xl object-cover border-8 border-white min-h-[500px]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold mb-6 text-gray-900"
            >
              {t('about_page.why_title')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              {t('about_page.why_desc')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col sm:flex-row gap-6 items-start"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-inner">
                  <feature.icon size={28} className="text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GALLERY */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">{t('about_page.gallery_title')}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
            {galleryImages.map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative overflow-hidden rounded-2xl group shadow-sm ${idx === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}
              >
                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img
                  src={src}
                  alt="Klinika galeriyasi"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
