import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTelegram, FaInstagram, FaFacebook } from 'react-icons/fa';
import logo from '../assets/logo_transparent.png';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-950 text-white pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Col 1: Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Logo" className="h-12 w-auto" />
              <span className="text-xl font-bold text-white">As-salaam Clinic</span>
            </Link>
            <p className="text-gray-400 leading-relaxed">{t('footer.desc')}</p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <FaTelegram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <FaFacebook size={20} />
              </a>
            </div>
          </div>

          {/* Col 2: Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-l-4 border-primary pl-3">{t('footer.links')}</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/" className="hover:text-primary transition-colors">{t('nav.home')}</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">{t('nav.services')}</Link></li>
              <li><Link to="/doctors" className="hover:text-primary transition-colors">{t('nav.doctors')}</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-l-4 border-primary pl-3">{t('footer.info')}</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/services" className="hover:text-primary transition-colors">Ortopedia</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Neyroxirurgiya</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Vertebrologiya</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold border-l-4 border-primary pl-3">{t('footer.address_title')}</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-primary mt-1 flex-shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-primary flex-shrink-0" />
                <span>+998 90 544 77 07</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} As-salaam Clinic. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
