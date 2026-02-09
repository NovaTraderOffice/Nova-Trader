import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // <--- Am adăugat useLocation
import { Menu, X } from 'lucide-react';
import ProfileButton from '@/components/ProfileButton';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const isLoggedIn = !!user;
  
  const location = useLocation(); // <--- 1. Aflăm pagina curentă

  // 2. Funcție ajutătoare: Verifică dacă link-ul e activ
  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? "text-yellow-500 font-bold transition-colors" // Stil pentru activ
      : "text-white hover:text-yellow-500 transition-colors"; // Stil normal
  };

  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-yellow-600/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="https://horizons-cdn.hostinger.com/dc9b4162-1bbf-4707-8c44-a1438cae6f40/0ae6ba864687d9b0461ed709d097c19f.jpg" alt="Nova Trader Logo" className="h-10" />
            <span className="text-2xl font-bold gold-text">Nova Trader</span>
          </Link>

          {/* MENIUL DESKTOP */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={getLinkClass('/')}>Ana Sayfa</Link>
            <Link to="/kurslar" className={getLinkClass('/kurslar')}>Kurslar</Link>
            <Link to="/abonelikler" className={getLinkClass('/abonelikler')}>Abonelikler</Link>
            <Link to="/hakkimizda" className={getLinkClass('/hakkimizda')}>Hakkımızda</Link>
            <Link to="/yorumlar" className={getLinkClass('/yorumlar')}>Yorumlar</Link>
            <Link to="/iletisim" className={getLinkClass('/iletisim')}>İletişim</Link>
            <Link to="/ticaret-araclari" className={getLinkClass('/ticaret-araclari')}>Ticaret Araçları</Link>
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

        {/* MENIUL MOBIL */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-yellow-600/20 pt-4 space-y-3">
            <Link to="/" className={`block ${getLinkClass('/')}`} onClick={() => setIsMenuOpen(false)}>Ana Sayfa</Link>
            <Link to="/kurslar" className={`block ${getLinkClass('/kurslar')}`} onClick={() => setIsMenuOpen(false)}>Kurslar</Link>
            <Link to="/abonelikler" className={`block ${getLinkClass('/abonelikler')}`} onClick={() => setIsMenuOpen(false)}>Abonelikler</Link>
            {isLoggedIn && (
              <Link to="/urunlerim" className={`block ${getLinkClass('/urunlerim')}`} onClick={() => setIsMenuOpen(false)}>Ürünlerim</Link>
            )}
            <Link to="/hakkimizda" className={`block ${getLinkClass('/hakkimizda')}`} onClick={() => setIsMenuOpen(false)}>Hakkımızda</Link>
            <Link to="/yorumlar" className={`block ${getLinkClass('/yorumlar')}`} onClick={() => setIsMenuOpen(false)}>Yorumlar</Link>
            <Link to="/iletisim" className={`block ${getLinkClass('/iletisim')}`} onClick={() => setIsMenuOpen(false)}>İletişim</Link>
            <Link to="/ticaret-araclari" className={`block ${getLinkClass('/ticaret-araclari')}`} onClick={() => setIsMenuOpen(false)}>Ticaret Araçları</Link>
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