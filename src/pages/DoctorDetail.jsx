import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaGraduationCap, FaMedal, FaPhoneAlt, FaEnvelope, FaCalendarAlt, FaStethoscope } from 'react-icons/fa';
import BookingForm from '../components/BookingForm';

const DoctorDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const doctor = useSelector(state => state.doctors.items.find(d => d.id === id));

  const availableServices = useSelector(state =>
    doctor ? state.services.items.filter(s => doctor.availableServices?.includes(s.id)) : []
  );

  if (!doctor) {
    return <Navigate to="/doctors" />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT: DOCTOR PROFILE & CTA */}
          <div className="lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 sticky top-24"
            >
              <div className="h-80 relative overflow-hidden rounded-3xl">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-bold rounded-lg mb-2">
                    {doctor.experience}
                  </span>
                  <h1 className="text-2xl font-bold">{doctor.name}</h1>
                  <p className="text-gray-300">{doctor.role}</p>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">{t('doctor.contact')}</h3>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                        <FaPhoneAlt />
                      </div>
                      <span className="font-medium">{doctor.contact?.phone || '+998 90 544 77 07'}</span>
                    </li>
                    <li className="flex items-center gap-3 text-gray-700">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                        <FaEnvelope />
                      </div>
                      <span className="font-medium">{doctor.contact?.email || 'info@as-salaam.uz'}</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <BookingForm doctorId={doctor.id} className="!shadow-none !border-none !p-0" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: DETAILS */}
          <div className="lg:w-2/3 space-y-12">

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">{t('doctor.about')}</h2>
              <div className="prose prose-lg text-gray-600 max-w-none">
                <p>{doctor.about || doctor.bio}</p>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <FaGraduationCap className="text-primary" />
                {t('doctor.education')}
              </h2>
              <p className="text-lg text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 font-medium leading-relaxed">
                {doctor.education || doctor.specialty || doctor.specialization}
              </p>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <FaMedal className="text-yellow-500" />
                {t('doctor.methods')}
              </h2>
              <ul className="space-y-4">
                {(doctor.methods ? doctor.methods.split(',') : (doctor.certificates || [])).map((cert, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 shrink-0"></div>
                    <span className="text-gray-700 font-medium">{cert.trim()}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            {availableServices.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <FaStethoscope className="text-primary" />
                  {t('doctor.services')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableServices.map(service => (
                    <Link
                      key={service.id}
                      to={`/services/${service.id}`}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md hover:border-primary/30 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <FaStethoscope />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{service.title}</h4>
                        <span className="text-sm text-gray-500">{t('doctor.view')}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
