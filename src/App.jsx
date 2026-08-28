import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctors } from './slices/doctorsSlice';
import { fetchServices } from './slices/servicesSlice';
import { fetchDiseases } from './slices/diseasesSlice';

// Layouts (loaded eagerly - needed immediately)
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Public Pages (lazy loaded)
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail'));
const DiseaseDetail = lazy(() => import('./pages/DiseaseDetail'));
const Doctors = lazy(() => import('./pages/Doctors'));
const DoctorDetail = lazy(() => import('./pages/DoctorDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Booking = lazy(() => import('./pages/Booking'));

// Admin Pages (lazy loaded - heavy pages, loaded only when visited)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminRooms = lazy(() => import('./pages/admin/AdminRooms'));
const AdminPatients = lazy(() => import('./pages/admin/AdminPatients'));
const AdminDoctors = lazy(() => import('./pages/admin/AdminDoctors'));
const AdminTreatments = lazy(() => import('./pages/admin/AdminTreatments'));
const AdminLabs = lazy(() => import('./pages/admin/AdminLabs'));
const AdminFinance = lazy(() => import('./pages/admin/AdminFinance'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

// Fast inline spinner for page transitions
const PageSkeleton = () => (
  <div className="flex items-center justify-center h-64 w-full">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-[#0052CC]/20 border-t-[#0052CC] rounded-full animate-spin"></div>
      <p className="text-sm text-gray-400 font-medium">Yuklanmoqda...</p>
    </div>
  </div>
);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const dispatch = useDispatch();
  
  const docsStatus = useSelector((state) => state.doctors.status);
  const srvStatus = useSelector((state) => state.services.status);
  const disStatus = useSelector((state) => state.diseases.status);

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchServices());
    dispatch(fetchDiseases());
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:id" element={<ServiceDetail />} />
            <Route path="diseases/:id" element={<DiseaseDetail />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="doctors/:id" element={<DoctorDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="booking" element={<Booking />} />
          </Route>

          {/* ADMIN LOGIN */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="finance" element={<AdminFinance />} />
              <Route path="rooms" element={<AdminRooms />} />
              <Route path="patients" element={<AdminPatients />} />
              <Route path="doctors" element={<AdminDoctors />} />
              <Route path="treatments" element={<AdminTreatments />} />
              <Route path="labs" element={<AdminLabs />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
