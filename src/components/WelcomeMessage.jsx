import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const WelcomeMessage = () => {
  return (
    <motion.div 
      className="w-full lg:w-1/2 text-center lg:text-left pr-0 lg:pr-12 mb-12 lg:mb-0"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
        Finansal Geleceğinizi
        <br />
        <span className="gold-text">Bugün Şekillendirin</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8">
        NovaTrader ile borsa ve kripto para piyasalarında uzmanlaşın. Profesyonel eğitimler, canlı yayınlar ve gelişmiş araçlarla yatırım becerilerinizi zirveye taşıyın.
      </p>
      <Link to="/kurslar">
        <Button size="lg" className="gold-gradient text-black font-bold text-lg px-8 py-6 rounded-xl hover:scale-105 transition-transform">
          Kursları İncele
        </Button>
      </Link>
    </motion.div>
  );
};

export default WelcomeMessage;