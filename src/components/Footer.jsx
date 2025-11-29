import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Send, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/80 border-t border-yellow-600/20 mt-20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="https://horizons-cdn.hostinger.com/dc9b4162-1bbf-4707-8c44-a1438cae6f40/0ae6ba864687d9b0461ed709d097c19f.jpg" alt="Nova Trader Logo" className="h-10" />
              <span className="text-2xl font-bold gold-text">Nova Trader</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Türkiye'nin en güvenilir borsa ve yatırım eğitim platformu.
            </p>
          </div>

          <div>
            <span className="text-yellow-500 font-semibold mb-4 block">Hızlı Linkler</span>
            <div className="space-y-2">
              <Link to="/kurslar" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Kurslar</Link>
              <Link to="/abonelikler" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Abonelikler</Link>
              <Link to="/hakkimizda" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Hakkımızda</Link>
              <Link to="/iletisim" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">İletişim</Link>
              <Link to="/ticaret-araclari" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Ticaret Araçları</Link>
            </div>
          </div>

          <div>
            <span className="text-yellow-500 font-semibold mb-4 block">Yasal</span>
            <div className="space-y-2">
              <Link to="#" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Gizlilik Politikası</Link>
              <Link to="#" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">Kullanım Şartları</Link>
              <Link to="#" className="block text-gray-400 hover:text-yellow-500 transition-colors text-sm">İade Politikası</Link>
            </div>
          </div>

          <div>
            <span className="text-yellow-500 font-semibold mb-4 block">Sosyal Medya</span>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <Send className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-500 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-yellow-600/20 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 Nova Trader - Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;