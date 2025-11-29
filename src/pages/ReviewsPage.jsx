import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/use-toast';

const ReviewsPage = () => {
  const [reviews] = useState([
    {
      id: 1,
      name: "Ahmet K.",
      rating: 5,
      comment: "NovaTrader sayesinde trading dünyasına adım attım. Eğitimler çok kaliteli ve anlaşılır. Kesinlikle tavsiye ederim!",
      course: "Temel Borsa Eğitimi",
      date: "15 Ocak 2025"
    },
    {
      id: 2,
      name: "Zeynep M.",
      rating: 5,
      comment: "İleri seviye kurs gerçekten harika. Profesyonel stratejiler öğrendim ve portföyümü büyüttüm.",
      course: "İleri Seviye Trading Stratejileri",
      date: "10 Ocak 2025"
    },
    {
      id: 3,
      name: "Can Y.",
      rating: 4,
      comment: "Kripto para eğitimi çok faydalıydı. Artık hangi coinlere yatırım yapacağımı biliyorum.",
      course: "Kripto Para Yatırım Rehberi",
      date: "5 Ocak 2025"
    },
    {
      id: 4,
      name: "Ayşe T.",
      rating: 5,
      comment: "Risk yönetimi kursu sayesinde kayıplarımı minimize ettim. Çok teşekkürler NovaTrader!",
      course: "Risk Yönetimi ve Portföy Oluşturma",
      date: "28 Aralık 2024"
    }
  ]);

  const handleSubmitReview = () => {
    toast({
      title: "🚧 Bu özellik henüz aktif değil",
      description: "Yorum ekleme özelliği yakında eklenecek! Bir sonraki mesajınızda isteyebilirsiniz! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>Yorumlar - NovaTrader</title>
        <meta name="description" content="NovaTrader öğrencilerinin deneyimlerini ve yorumlarını okuyun." />
      </Helmet>

      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gold-text">Öğrenci Yorumları</span>
          </h1>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Binlerce öğrencimizin deneyimlerini okuyun
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="premium-card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{review.name}</h3>
                    <p className="text-sm text-gray-400">{review.course}</p>
                  </div>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{review.comment}</p>
                <p className="text-xs text-gray-500">{review.date}</p>
              </motion.div>
            ))}
          </div>

          <div className="premium-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center text-yellow-500">
              Siz de Yorumunuzu Paylaşın
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Kurs satın aldıktan sonra deneyiminizi paylaşabilirsiniz
            </p>
            <Button onClick={handleSubmitReview} className="w-full gold-gradient text-black font-semibold hover:opacity-90">
              Yorum Yaz
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ReviewsPage;