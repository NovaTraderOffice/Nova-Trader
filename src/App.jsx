import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2, Send } from 'lucide-react';

// HOOKS
import { useAuth } from '@/contexts/AuthContext';

// IMPORTS
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import PrivacyNotice from '@/components/PrivacyNotice';
import TickerTape from '@/components/TickerTape';
import ScrollProgress from '@/components/ScrollProgress';
import SocialProof from '@/components/SocialProof';
import AdminRoute from '@/components/AdminRoute';

// PAGES
import ComingSoonPage from '@/pages/ComingSoonPage';
import AdminDashboard from '@/pages/AdminDashboard';
import SuccessPage from '@/pages/SuccessPage';
import CoursePlayerPage from '@/pages/CoursePlayerPage';
import ProfilePage from '@/pages/ProfilePage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CoursesPage from '@/pages/CoursesPage';
import MyProductsPage from '@/pages/MyProductsPage';
import CheckoutPage from '@/pages/CheckoutPage';
import AboutPage from '@/pages/AboutPage';
import ReviewsPage from '@/pages/ReviewsPage';
import ContactPage from '@/pages/ContactPage';
import SubscriptionsPage from '@/pages/SubscriptionsPage';
import TradingToolsPage from '@/pages/TradingToolsPage';
import NotFoundPage from '@/pages/NotFoundPage';

const GlobalLoader = () => (
  <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-[9999]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-16 h-16 animate-spin text-yellow-500" />
      <p className="text-xl text-yellow-500">Yükleniyor...</p>
    </div>
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <GlobalLoader />;
  return user ? children : <Navigate to="/giris" state={{ from: location }} replace />;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <GlobalLoader />;
  return user ? <Navigate to="/urunlerim" replace /> : children;
};

function App() {
  const TELEGRAM_SUPPORT_USERNAME = "NovaTrader_SupportBot"; 

  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE === 'true';

  if (isMaintenanceMode) {
    return (
      <Routes>
        <Route path="*" element={<ComingSoonPage />} />
      </Routes>
    );
  }

  return (
    <> 
      <ScrollToTop />
      <ScrollProgress />
      
      <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-white relative">
        <TickerTape />
        <Header />
   
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/kurslar" element={<CoursesPage />} />
            <Route path="/abonelikler" element={<SubscriptionsPage />} />
            <Route path="/hakkimizda" element={<AboutPage />} />
            <Route path="/yorumlar" element={<ReviewsPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/ticaret-araclari" element={<TradingToolsPage />} />

            <Route path="/profil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            
            <Route path="/giris" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/kayit" element={<AuthRoute><RegisterPage /></AuthRoute>} />
            
            <Route path="/urunlerim" element={<PrivateRoute><MyProductsPage /></PrivateRoute>} />
            <Route path="/odeme/:courseId" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />

            <Route path="/kurs/:courseId" element={<PrivateRoute><CoursePlayerPage /></PrivateRoute>} />
            <Route path="/basarili" element={<PrivateRoute><SuccessPage /></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        
        <Footer />
        <a 
          href={`https://t.me/${TELEGRAM_SUPPORT_USERNAME}`} 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] z-50 transition-transform hover:scale-110 flex items-center gap-2 group"
          title="Destek Hattı"
        >
          <Send className="w-6 h-6 fill-current" />
          <span className="font-bold hidden md:inline max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap">
            Destek
          </span>
        </a>
       
        <SocialProof />
        <PrivacyNotice />
      </div>
    </>
  );
}

export default App;