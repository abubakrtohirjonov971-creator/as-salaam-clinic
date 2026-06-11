import React from 'react';
import logo from '../assets/logo_transparent.png';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <img 
          src={logo} 
          alt="As-salaam Clinic" 
          className="w-24 h-24 object-contain animate-pulse" 
        />
        
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-[#0052CC]/20 border-t-[#0052CC] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium text-sm tracking-widest uppercase">
            Yuklanmoqda...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
