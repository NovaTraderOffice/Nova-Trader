import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Cookie } from 'lucide-react';
// Dacă nu ai instalat framer-motion, scoate importul de mai jos și animațiile
import { motion, AnimatePresence } from 'framer-motion'; 

const PrivacyNotice = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('novaCookieConsent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('novaCookieConsent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="bg-[#1a1a1a] border border-yellow-600/30 rounded-xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 relative">
              
              <button 
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4">
                <div className="bg-yellow-500/10 p-3 rounded-full hidden md:block">
                  <Cookie className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Gizlilik</h3>
                  <p className="text-sm text-gray-400">
                    Trading deneyimini geliştirmek için çerezler kullanıyoruz.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <Button 
                  variant="outline" 
                  onClick={() => setIsVisible(false)}
                  className="flex-1 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  Kapat
                </Button>
                <Button 
                  onClick={handleAccept}
                  className="flex-1 bg-yellow-500 text-black font-bold hover:bg-yellow-400"
                >
                  Anladım
                </Button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyNotice;