import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PublicLayout = () => {
  const [isTg, setIsTg] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      if (tg.initData) {
        setIsTg(true);
        tg.ready();
        tg.expand();
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {!isTg && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isTg && <Footer />}
    </div>
  );
};

export default PublicLayout;
