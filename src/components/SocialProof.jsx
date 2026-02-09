import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle } from 'lucide-react';

const names = ["Alex", "Mehmet", "Andrei", "Ayşe", "Elena", "Can", "Stefan", "Burak"];
const cities = ["București", "Istanbul", "Cluj", "Ankara", "Izmir", "Timișoara", "Antalya"];
const actions = [
  "VIP Üyelik satın aldı",
  "Temel Borsa Eğitimi'ne katıldı",
  "İleri Seviye Trading paketini aldı",
  "Topluluğa yeni katıldı"
];

const SocialProof = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({ name: '', city: '', action: '' });

  useEffect(() => {
    const showToast = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      
      setData({ name: randomName, city: randomCity, action: randomAction });
      setIsVisible(true);

      // Ascunde după 5 secunde
      setTimeout(() => setIsVisible(false), 10000);
    };

    // Pornește primul toast după 5 secunde
    const initialTimer = setTimeout(showToast, 5000);

    // Repetă la fiecare 20 de secunde
    const interval = setInterval(showToast, 20000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-24 left-4 z-50 max-w-sm hidden md:block"
        >
          <div className="bg-[#1a1a1a]/90 backdrop-blur-md border border-yellow-500/30 p-4 rounded-xl shadow-2xl flex items-center gap-4">
            <div className="bg-yellow-500/20 p-2 rounded-full">
              <User className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {data.name} <span className="text-gray-400 font-normal">({data.city})</span>
              </p>
              <p className="text-xs text-yellow-500 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> {data.action}
              </p>
              <p className="text-[10px] text-gray-500 mt-1">Az önce</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialProof;