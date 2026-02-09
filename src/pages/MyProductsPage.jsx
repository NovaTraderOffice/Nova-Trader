
import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

const MyProductsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Ürünlerim - NovaTrader</title>
        <meta name="description" content="Satın aldığınız kurslar ve aboneliklere buradan erişebilirsiniz." />
      </Helmet>

      <div className="container mx-auto px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold mb-2">Hoş Geldiniz, <span className="gold-text">{user?.email || 'Kullanıcı'}</span></h1>
          <p className="text-gray-400 mb-12">Aktif ürünleriniz ve abonelikleriniz</p>

          <div className="premium-card p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h2 className="text-2xl font-bold mb-4 text-gray-400">Henüz aktif ürününüz yok</h2>
            <p className="text-gray-500 mb-6">Eğitim kurslarımıza veya aboneliklerimize göz atarak öğrenmeye başlayın!</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={() => navigate('/kurslar')} className="gold-gradient text-black font-semibold hover:opacity-90">Kurslara Göz At</Button>
              <Button onClick={() => navigate('/abonelikler')} variant="outline" className="border-yellow-600 text-yellow-500 hover:bg-yellow-600 hover:text-black">Abonelikler</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default MyProductsPage;
