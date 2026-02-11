import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Send, Instagram, Youtube, Twitter, Bell } from 'lucide-react';

const ComingSoonPage = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden px-4">
      <Helmet>
        <title>Nova Trader | Çok Yakında</title>
      </Helmet>

      {/* Efecte de fundal (Glow aurie) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-600/10 blur-[120px] rounded-full" />

      {/* Continut Principal */}
      <div className="relative z-10 text-center max-w-2xl w-full">
        <div className="flex justify-center mb-8">
          <img 
            src="https://horizons-cdn.hostinger.com/dc9b4162-1bbf-4707-8c44-a1438cae6f40/0ae6ba864687d9b0461ed709d097c19f.jpg" 
            alt="Nova Trader Logo" 
            className="h-20 w-auto rounded-2xl shadow-2xl shadow-yellow-500/20 animate-pulse"
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">
          FINANSAL <span className="gold-text">DEVRIM</span> <br /> ÇOK YAKINDA
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-12 font-light leading-relaxed">
          Nova Trader ile borsa ve yatırım dünyasında yeni un standarda hazırlanın. 
          Eğitim platformumuz kapılarını açmak üzere.
        </p>

        {/* Formular de abonare */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-16">
          <input 
            type="email" 
            placeholder="E-posta adresinizi bırakın..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white outline-none focus:border-yellow-500/50 transition-all"
          />
          <button className="gold-gradient text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center group">
            <Bell className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
            Haber Ver
          </button>
        </div>
      </div>

      {/* Footer mic */}
      <div className="absolute bottom-8 text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">
        © 2026 NOVA TRADER
      </div>
    </div>
  );
};

export default ComingSoonPage;