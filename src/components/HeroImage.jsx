import React from 'react';
import { motion } from 'framer-motion';

const HeroImage = () => {
  return (
    <motion.div 
      className="w-full lg:w-1/2"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
    >
      <img
        class="rounded-3xl shadow-2xl shadow-yellow-500/10"
        alt="Kripto para ve borsa grafikleri olan modern bir çalışma alanı"
       src="https://images.unsplash.com/photo-1605588722627-818efb8878b9" />
    </motion.div>
  );
};

export default HeroImage;