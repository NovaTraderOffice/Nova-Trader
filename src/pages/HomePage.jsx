import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Star, Zap, BarChart2 } from 'lucide-react';
import WelcomeMessage from '@/components/WelcomeMessage';
import HeroImage from '@/components/HeroImage';

const featuredCourses = [
  {
    id: '1',
    title: 'Temel Borsa Eğitimi',
    description: 'Borsaya sıfırdan başlayanlar için kapsamlı başlangıç paketi.',
    price: '199€',
  },
  {
    id: '2',
    title: 'İleri Seviye Trading Stratejileri',
    description: 'Profesyonel traderlar için gelişmiş teknik analiz ve risk yönetimi.',
    price: '199€',
  },
  {
    id: '5',
    title: 'Tümü Bir Arada: Borsa Uzmanlık Paketi',
    description: 'Temel ve İleri Seviye kursların birleşimiyle tam kapsamlı uzmanlık.',
    price: '299€',
    isPopular: true
  },
];

const features = [
  {
    icon: <BarChart2 className="w-8 h-8 mb-4 gold-text" />,
    title: 'Uzman Tarafından Hazırlanan İçerik',
    description: 'Yılların tecrübesiyle oluşturulmuş, piyasa koşullarına uygun, güncel ve pratik eğitimler.',
  },
  {
    icon: <Zap className="w-8 h-8 mb-4 gold-text" />,
    title: 'Anında Erişim',
    description: 'Satın aldığınız tüm kurslara ve materyallere ömür boyu, anında erişim sağlayın.',
  },
  {
    icon: <Star className="w-8 h-8 mb-4 gold-text" />,
    title: 'Öğrenci Topluluğu',
    description: 'Diğer öğrencilerle ve eğitmenlerle etkileşimde bulunun, fikir alışverişi yapın.',
  },
];

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>NovaTrader - Profesyonel Borsa ve Kripto Eğitim Platformu</title>
        <meta name="description" content="NovaTrader ile borsa ve kripto para piyasalarında uzmanlaşın. Profesyonel eğitim kursları, canlı yayınlar ve ticaret araçları ile yatırım becerilerinizi geliştirin." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col lg:flex-row items-center justify-between">
        <WelcomeMessage />
        <HeroImage />
      </section>

      {/* Features Section */}
      <section className="bg-[#141414] py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Neden <span className="gold-text">NovaTrader</span>?</h2>
            <p className="text-gray-400 mt-2">Finansal piyasalarda başarıya giden yolda size rehberlik ediyoruz.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="premium-card p-8 text-center"
              >
                {feature.icon}
                <h3 className="text-xl font-bold mb-2 text-yellow-500">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold">Öne Çıkan <span className="gold-text">Kurslar</span></h2>
            <p className="text-gray-400 mt-2">En popüler eğitimlerimizle hemen öğrenmeye başlayın.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="premium-card p-6 flex flex-col hover:scale-105 transition-transform"
              >
                {course.isPopular && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPÜLER</div>
                )}
                <h3 className="text-xl font-bold mb-2 text-yellow-500">{course.title}</h3>
                <p className="text-gray-400 mb-4 flex-grow">{course.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold gold-text">{course.price}</span>
                  <Link to={`/odeme/${course.id}`}>
                    <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors">
                      Satın Al
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;