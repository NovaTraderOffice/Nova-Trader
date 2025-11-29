
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Mail, HelpCircle, Phone } from 'lucide-react';

const ContactPage = () => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "🚧 İletişim Formu Bekleniyor",
        description: "Backend entegrasyonu yakında eklenecek!",
      });
      setName('');
      setEmail('');
      setMessage('');
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>İletişim - Nova Trader</title>
        <meta name="description" content="Nova Trader ile iletişime geçin. Sorularınız, önerileriniz veya destek talepleriniz için bize yazın." />
      </Helmet>
      <div className="container mx-auto px-4 py-20">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gold-text">Bizimle İletişime Geçin</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Sorularınız veya geri bildirimleriniz mi var? Sizden haber almayı çok isteriz.
          </p>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8 max-w-2xl mx-auto"
          >
            <div className="premium-card p-6">
              <h3 className="text-2xl font-bold mb-4 text-yellow-500">İletişim Bilgileri</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-yellow-500" />
                  <a href="mailto:help.novatrader@gmail.com" className="hover:text-yellow-500 transition-colors">help.novatrader@gmail.com</a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-yellow-500" />
                  <span>(En kısa sürede eklenecektir)</span>
                </div>
              </div>
            </div>
            <div className="premium-card p-6">
              <h3 className="text-2xl font-bold mb-4 text-yellow-500">Sıkça Sorulan Sorular</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Kurslara nasıl erişebilirim?</p>
                    <p className="text-sm text-gray-400">Satın alımdan sonra "Aktif Ürünlerim" sayfasından tüm içeriklerinize anında erişebilirsiniz.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <HelpCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Geri iade politikanız nedir?</p>
                    <p className="text-sm text-gray-400">Dijital ürünlerimizde geri iade bulunmamaktadır. Lütfen satın almadan önce açıklamaları dikkatlice okuyun.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
