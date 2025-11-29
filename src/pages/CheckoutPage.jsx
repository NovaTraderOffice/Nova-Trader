
import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const CheckoutPage = () => {
  const { productId } = useParams();
  const { toast } = useToast();

  const mockProducts = {
    '1': { name: 'Temel Borsa Eğitimi', price: 149, category: 'kurslar' },
    '2': { name: 'İleri Seviye Trading', price: 249, category: 'kurslar' },
    '5': { name: 'Komple Eğitim Paketi', price: 299, category: 'kurslar' },
    'sub_vip_149': { name: 'VIP Üyelik', price: 149, category: 'abonelik' }
  };

  const product = mockProducts[productId] || { name: 'Ürün', price: 0, category: 'kurslar' };

  const handlePayment = () => {
    toast({
      title: "🚧 Ödeme Entegrasyonu Bekleniyor",
      description: "Bu özellik yakında eklenecek! Bir sonraki mesajınızda isteyebilirsiniz! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Ödeme - {product.name}</title>
        <meta name="description" content={`NovaTrader platformunda ${product.name} için ödeme yapın.`} />
      </Helmet>
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center mb-4">
            <span className="gold-text">Güvenli Ödeme</span>
          </h1>
          <p className="text-gray-400 text-center mb-12">Siparişinizi tamamlamak için son bir adım kaldı.</p>

          <div className="premium-card p-8">
            <h2 className="text-2xl font-bold mb-6">Sipariş Özeti</h2>
            
            <div className="border-b border-gray-700 pb-6 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img className="w-16 h-16 rounded-lg object-cover mr-4" alt={product.name} src="https://images.unsplash.com/photo-1671376354106-d8d21e55dddd" />
                  <div>
                    <p className="font-semibold text-lg">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.category === 'abonelik' ? 'Aylık Abonelik' : 'Tek Seferlik Kurs'}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold gold-text">{product.price}€</p>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <p className="text-xl font-semibold">Toplam Tutar</p>
              <p className="text-3xl font-bold gold-text">{product.price}€</p>
            </div>

            <Button onClick={handlePayment} className="w-full gold-gradient text-black font-bold text-lg py-6 hover:opacity-90 transition-all duration-300 transform hover:scale-105">
              <CreditCard className="w-5 h-5 mr-3" />
              Ödemeyi Tamamla
            </Button>

            <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
              <Lock className="w-4 h-4 mr-2" />
              <span>Tüm işlemler 256-bit SSL şifrelemesi ile korunmaktadır.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default CheckoutPage;
