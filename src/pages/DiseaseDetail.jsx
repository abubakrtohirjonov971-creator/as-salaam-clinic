import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaExclamationTriangle, FaStethoscope, FaChevronDown, FaChevronUp, FaHandHoldingMedical } from 'react-icons/fa';
import DoctorCard from '../components/DoctorCard';
import BookingForm from '../components/BookingForm';

const DiseaseDetail = () => {
  const { id } = useParams();
  const disease = useSelector(state => state.diseases?.items?.find(d => d.id === id));
  
  const relatedDoctor = useSelector(state => 
    disease ? state.doctors.items.find(doc => doc.id === disease.relatedDoctor) : null
  );

  const relatedServices = useSelector(state => 
    disease ? state.services.items.filter(s => disease.relatedServices.includes(s.id)) : []
  );

  const [activeFaq, setActiveFaq] = useState(null);

  if (!disease) {
    return <Navigate to="/" />; // fallback if disease not found
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={disease.image} 
            alt={disease.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-white pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block py-1 px-4 bg-red-500/20 border border-red-500/30 rounded-full text-red-100 font-bold mb-6">
              Kasallik haqida
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">{disease.title}</h1>
            <p className="text-xl text-gray-300 leading-relaxed">{disease.desc}</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 mt-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* MAIN CONTENT */}
          <div className="lg:w-2/3 space-y-16">
            
            {/* 2. DESCRIPTION */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Kasallik ta'rifi</h2>
              <p className="text-lg text-gray-600 leading-relaxed">{disease.fullDesc}</p>
            </motion.section>

            {/* 3. CAUSES & SYMPTOMS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <FaExclamationTriangle className="text-orange-500" />
                  Kelib chiqish sabablari
                </h2>
                <ul className="space-y-4">
                  {disease.causes.map((cause, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                      <span className="text-gray-700">{cause}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <FaStethoscope className="text-red-500" />
                  Asosiy belgilar (Simptomlar)
                </h2>
                <ul className="space-y-4">
                  {disease.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0"></div>
                      <span className="text-gray-700">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            </div>

            {/* 4. RISK FACTORS & PREVENTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-100 p-8 rounded-3xl"
              >
                <h3 className="text-xl font-bold mb-4 text-gray-900">Xavf omillari</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {disease.riskFactors.map((factor, idx) => (
                    <li key={idx}>{factor}</li>
                  ))}
                </ul>
              </motion.section>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-green-50 p-8 rounded-3xl"
              >
                <h3 className="text-xl font-bold mb-4 text-green-900 flex items-center gap-2">
                  <FaShieldAlt className="text-green-500" />
                  Profilaktika
                </h3>
                <ul className="list-disc list-inside space-y-2 text-green-800">
                  {disease.prevention.map((prev, idx) => (
                    <li key={idx}>{prev}</li>
                  ))}
                </ul>
              </motion.section>
            </div>

            {/* 5. TREATMENT */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Qanday davolanadi?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {disease.treatments.map((treatment, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl mb-4 font-bold">
                      {idx + 1}
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-gray-900">{treatment.title}</h3>
                    <p className="text-gray-600">{treatment.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 6. RECOVERY */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-blue-50 border border-blue-100 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <FaHandHoldingMedical className="text-3xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2 text-blue-900">Tiklanish jarayoni</h3>
                <p className="text-blue-800 text-lg">{disease.recoveryProcess}</p>
              </div>
            </motion.section>

            {/* 7. FAQ */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Bemorlar savollari</h2>
              <div className="space-y-4">
                {disease.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <button 
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                    >
                      <span className="font-bold text-lg text-gray-900">{faq.q}</span>
                      {activeFaq === idx ? <FaChevronUp className="text-primary" /> : <FaChevronDown className="text-gray-400" />}
                    </button>
                    <AnimatePresence>
                      {activeFaq === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6 text-gray-600 border-t border-gray-50 pt-4"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.section>

          </div>

          {/* SIDEBAR */}
          <div className="lg:w-1/3 space-y-8">
            <div className="sticky top-24 space-y-8">
              <BookingForm className="" />

              {/* RELATED DOCTOR */}
              {relatedDoctor && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <FaStethoscope className="text-primary" />
                    Mutaxassis shifokor
                  </h3>
                  <DoctorCard doctor={relatedDoctor} />
                </div>
              )}

              {/* RELATED SERVICES */}
              {relatedServices.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-6 text-gray-900">Aloqador xizmatlar</h3>
                  <div className="space-y-4">
                    {relatedServices.map(service => (
                      <Link 
                        key={service.id} 
                        to={`/services/${service.id}`}
                        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <FaStethoscope />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{service.title}</h4>
                          <span className="text-sm text-gray-500">Batafsil ko'rish</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DiseaseDetail;
