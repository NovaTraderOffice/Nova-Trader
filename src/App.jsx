import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// IMPORTS
import { AuthProvider, useAuth } from './contexts/AuthContext'; // <--- NEW IMPORT
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// PAGES
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
  if (loading) return <GlobalLoader />;
  return user ? children : <Navigate to="/giris" replace />;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <GlobalLoader />;
  return user ? <Navigate to="/urunlerim" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#0f0f0f] text-white">
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
            
            <Route path="/giris" element={<AuthRoute><LoginPage /></AuthRoute>} />
            <Route path="/kayit" element={<AuthRoute><RegisterPage /></AuthRoute>} />
            
            <Route path="/urunlerim" element={<PrivateRoute><MyProductsPage /></PrivateRoute>} />
            <Route path="/odeme/:productId" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;