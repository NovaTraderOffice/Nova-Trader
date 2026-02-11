import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Send, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/80 border-t border-yellow-600/20 mt-20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-16">
        {/* Am trecut la 3 coloane (grid-cols-3) pentru o centrare naturală */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          {/* 1. LOGO & DESCRIERE - Centrat */}
          <div className="flex flex-col items-center space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="https://horizons-cdn.hostinger.com/dc9b4162-1bbf-4707-8c44-a1438cae6f40/0ae6ba864687d9b0461ed709d097c19f.jpg" 
                alt="Nova Trader Logo" 
                className="h-10 rounded" 
              />
              <span className="text-2xl font-bold gold-text uppercase tracking-tighter">Nova Trader</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">
              Türkiye'nin en güvenilir borsa ve yatırım eğitim platformu.
            </p>
          </div>

          {/* 2. LINKURI RAPIDE - Centrat */}
          <div className="flex flex-col items-center space-y-4">
            <span className="text-yellow-500 font-bold uppercase tracking-wider text-sm">Hızlı Linkler</span>
            <div className="space-y-2">
              <Link to="/kurslar" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Kurslar</Link>
              <Link to="/abonelikler" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Abonelikler</Link>
              <Link to="/hakkimizda" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Hakkımızda</Link>
              <Link to="/iletisim" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">İletişim</Link>
              <Link to="/ticaret-araclari" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Ticaret Araçları</Link>
            </div>
          </div>

          {/* 3. YASAL (LEGAL) - Centrat */}
          <div className="flex flex-col items-center space-y-4">
            <span className="text-yellow-500 font-bold uppercase tracking-wider text-sm">Yasal</span>
            <div className="space-y-2">
              <Link to="#" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Gizlilik Politikası</Link>
              <Link to="#" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Kullanım Şartları</Link>
              <Link to="#" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">İade Politikası</Link>
            </div>
          </div>
        </div>

        {/* COPYRIGHT - Linie de jos */}
        <div className="border-t border-yellow-600/10 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-xs tracking-widest">
            © 2026 NOVA TRADER - TÜM HAKLARI SAKLIDIR.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;