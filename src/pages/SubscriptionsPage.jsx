import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Check, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ROICalculator from '@/components/ROICalculator';

const SubscriptionsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  
  const subscription = {
    name: 'VIP Üyelik',
    price: 149,
    product_key: 'sub_vip_149'
  };

  const features = [
    'Özel VIP Sinyal Kanalı (Discord/Telegram)',
    'Portföy İncelemeleri ve Geri Bildirim',
    '7/24 Öncelikli Destek'
  ];
  
  const handleSubscribeClick = () => {
    if (!user) {
      toast({
        title: "Giriş Yapmalısınız",
        description: "Abonelik için yönlendiriliyorsunuz...",
      });
      navigate('/giris', { state: { from: location } });
    } else {
      toast({
        title: "🚧 Ödeme Sistemi Bekleniyor",
        description: "Abonelik ödemesi yakında eklenecek!",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>VIP Abonelik - NovaTrader</title>
        <meta name="description" content="NovaTrader VIP topluluğuna katılarak tüm özel avantajlardan yararlanın." />
      </Helmet>
      <div className="bg-[#0f0f0f] text-white">
        <div className="container mx-auto px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-yellow-500">NovaTrader VIP Üyelik</span>
            </h1>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Trading yolculuğunuzda zirveye oynamak için ihtiyacınız olan her şey tek bir pakette. Elit topluluğumuza katılın ve farkı hissedin.
            </p>
          </motion.div>

          <div className="bg-[#1a1a1a] max-w-4xl mx-auto overflow-hidden rounded-2xl border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-12 order-2 md:order-1">
                <div className="flex items-center bg-yellow-500/10 text-yellow-400 text-sm font-bold px-3 py-1 rounded-full mb-4 self-start w-fit">
                  <Zap className="w-4 h-4 mr-1.5" />TÜM AYRICALIKLAR DAHİL
                </div>
                <h2 className="text-3xl font-bold mb-6 text-white">{subscription.name}</h2>
                
                <ul className="space-y-3 mb-8">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="w-5 h-5 mr-3 mt-1 text-yellow-500 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="bg-black/30 p-6 rounded-lg mb-8">
                  <div className="flex items-baseline justify-between">
                    <p className="text-gray-400">Aylık Üyelik</p>
                    <div>
                      <span className="text-4xl font-bold text-yellow-500">{subscription.price}€</span>
                      <span className="text-gray-400">/ay</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSubscribeClick} className="w-full bg-yellow-500 text-black font-bold text-lg py-6 hover:bg-yellow-400 hover:scale-105 transition-all duration-300">
                  Hemen VIP Ol
                </Button>
              </div>
              <div className="order-1 md:order-2 h-64 md:h-full">
                <img className="w-full h-full object-cover" alt="Profesyonel trading grafikleri ve analizleri" src="https://images.unsplash.com/photo-1571677246347-5040036b95cc" />
              </div>
            </div>
          </div>
        </div>
        <ROICalculator />
      </div>
    </>
  );
};

export default SubscriptionsPage;