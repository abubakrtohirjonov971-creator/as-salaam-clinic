import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdAutorenew } from 'react-icons/md';

const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F5F7FB] flex-col">
        <MdAutorenew className="text-[#0052CC] animate-spin mb-4" size={48} />
        <p className="text-gray-500 font-medium">Tekshirilmoqda...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
