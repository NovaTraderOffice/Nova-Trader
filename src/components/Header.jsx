import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import ProfileButton from '@/components/ProfileButton';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-yellow-600/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://horizons-cdn.hostinger.com/dc9b4162-1bbf-4707-8c44-a1438cae6f40/0ae6ba864687d9b0461ed709d097c19f.jpg" alt="Nova Trader Logo" className="h-10" />
            <span className="text-2xl font-bold gold-text">Nova Trader</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-yellow-500 transition-colors">Ana Sayfa</Link>
            <Link to="/kurslar" className="text-white hover:text-yellow-500 transition-colors">Kurslar</Link>
            <Link to="/abonelikler" className="text-white hover:text-yellow-500 transition-colors">Abonelikler</Link>
            <Link to="/hakkimizda" className="text-white hover:text-yellow-500 transition-colors">Hakkımızda</Link>
            <Link to="/yorumlar" className="text-white hover:text-yellow-500 transition-colors">Yorumlar</Link>
            <Link to="/iletisim" className="text-white hover:text-yellow-500 transition-colors">İletişim</Link>
            <Link to="/ticaret-araclari" className="text-white hover:text-yellow-500 transition-colors">Ticaret Araçları</Link>
          </nav>

          <div className="flex items-center gap-4">
             <div className="hidden md:block">
              <ProfileButton />
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-yellow-600/20 pt-4 space-y-3">
            <Link to="/" className="block text-white hover:text-yellow-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Ana Sayfa</Link>
            <Link to="/kurslar" className="block text-white hover:text-yellow-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Kurslar</Link>
            <Link to="/abonelikler" className="block text-white hover:text-yellow-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Abonelikler</Link>
            {isLoggedIn && (
              <Link to="/urunlerim" className="block text-white hover:text-yellow-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Ürünlerim</Link>
            )}
            <Link to="/hakkimizda" className="block text-white hover:text-yellow-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Hakkımızda</Link>
            <Link to="/yorumlar" className="block text-white hover:text-yellow-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Yorumlar</Link>
            <Link to="/iletisim" className="block text-white hover:text-yellow-500 transition-colors" onClick={() => setIsMenuOpen(false)}>İletişim</Link>
            <Link to="/ticaret-araclari" className="block text-white hover:text-yellow-500 transition-colors" onClick={() => setIsMenuOpen(false)}>Ticaret Araçları</Link>
            <div className="pt-4 border-t border-yellow-600/20">
              <ProfileButton />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;