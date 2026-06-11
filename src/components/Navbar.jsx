import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPhoneAlt, FaBars, FaTimes, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo_transparent.png';
import Button from './Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.services'), path: '/services' },
    { name: t('nav.doctors'), path: '/doctors' },
    { name: t('nav.about'), path: '/about' },
  ];

  const isHome = location.pathname === '/';
  const textColor = isScrolled ? 'text-primary' : (isHome ? 'text-white' : 'text-primary');
  const linkColor = (path) =>
    location.pathname === path
      ? 'text-primary'
      : isScrolled
      ? 'text-gray-700'
      : isHome
      ? 'text-white'
      : 'text-gray-700';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 group">
          <img src={logo} alt="As-salaam Clinic Logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <span className={`text-lg md:text-xl xl:text-2xl font-bold tracking-wide ${textColor} whitespace-nowrap`}>
            As-salaam Clinic
          </span>
        </Link>

        {/* Center: Desktop Menu */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium text-sm xl:text-base transition-colors hover:text-primary whitespace-nowrap ${linkColor(link.path)}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4">
          <div className={`flex items-center gap-1.5 xl:gap-2 ${isScrolled ? 'text-gray-700' : (isHome ? 'text-white' : 'text-gray-700')}`}>
            <FaPhoneAlt className="text-primary text-sm xl:text-base" />
            <span className="font-semibold text-sm xl:text-base whitespace-nowrap">{t('nav.phone')}</span>
          </div>
          <div className="scale-90 xl:scale-100 origin-right">
            <Button to="/booking">{t('nav.booking')}</Button>
          </div>

          {/* Language switcher — after booking button */}
          <div className={`flex items-center gap-0.5 xl:gap-1 rounded-xl border p-1 ${isScrolled ? 'border-gray-200 bg-gray-50' : isHome ? 'border-white/30 bg-white/10' : 'border-gray-200 bg-gray-50'}`}>
            <button
              onClick={() => changeLanguage('uz')}
              className={`px-2 py-1 xl:px-3 rounded-lg text-xs xl:text-sm font-bold transition-all ${i18n.language === 'uz' ? 'bg-primary text-white shadow-sm' : isScrolled || !isHome ? 'text-gray-600 hover:text-primary' : 'text-white/70 hover:text-white'}`}
            >
              UZ
            </button>
            <button
              onClick={() => changeLanguage('ru')}
              className={`px-2 py-1 xl:px-3 rounded-lg text-xs xl:text-sm font-bold transition-all ${i18n.language === 'ru' ? 'bg-primary text-white shadow-sm' : isScrolled || !isHome ? 'text-gray-600 hover:text-primary' : 'text-white/70 hover:text-white'}`}
            >
              RU
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            className={`p-2 rounded-lg ${isScrolled ? 'text-gray-800' : (isHome ? 'text-white' : 'text-gray-800')}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-xl transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="p-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-lg font-medium p-2 rounded-lg hover:bg-blue-50 transition-colors ${location.pathname === link.path ? 'text-primary bg-blue-50' : 'text-gray-700'}`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <hr />
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3 text-gray-700">
              <FaPhoneAlt className="text-primary" />
              <span className="font-semibold">{t('nav.phone')}</span>
            </div>
            {/* Mobile language switcher */}
            <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => { changeLanguage('uz'); setIsOpen(false); }}
                className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${i18n.language === 'uz' ? 'bg-primary text-white' : 'text-gray-600'}`}
              >
                UZ
              </button>
              <button
                onClick={() => { changeLanguage('ru'); setIsOpen(false); }}
                className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${i18n.language === 'ru' ? 'bg-primary text-white' : 'text-gray-600'}`}
              >
                RU
              </button>
            </div>
          </div>
          <Button to="/booking" className="w-full" onClick={() => setIsOpen(false)}>{t('nav.booking')}</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
