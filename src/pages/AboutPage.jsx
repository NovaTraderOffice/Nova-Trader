import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Target, Users, Award, TrendingUp } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: <Target className="w-12 h-12 text-yellow-500" />,
      title: "Misyonumuz",
      description: "Trading eğitimini herkes için erişilebilir ve anlaşılır kılmak"
    },
    {
      icon: <Users className="w-12 h-12 text-yellow-500" />,
      title: "Topluluk",
      description: "Binlerce başarılı trader yetiştiren güçlü bir eğitim topluluğu"
    },
    {
      icon: <Award className="w-12 h-12 text-yellow-500" />,
      title: "Kalite",
      description: "Profesyonel eğitmenler ve güncel piyasa analizleri"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-yellow-500" />,
      title: "Başarı",
      description: "Öğrencilerimizin %85'i ilk 6 ayda karlı işlemler gerçekleştiriyor"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Hakkımızda - NovaTrader</title>
        <meta name="description" content="NovaTrader hakkında bilgi edinin. Misyonumuz, vizyonumuz ve değerlerimiz." />
      </Helmet>

      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gold-text">Hakkımızda</span>
          </h1>
          <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto text-lg">
            NovaTrader, Türkiye'nin en güvenilir ve kapsamlı borsa eğitim platformudur. 
            2020 yılından bu yana binlerce öğrenciye profesyonel trading eğitimi sunuyoruz.
          </p>

          <div className="premium-card p-8 md:p-12 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">Hikayemiz</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
              NovaTrader, trading dünyasının karmaşıklığını basitleştirmek ve Türk yatırımcılara 
              profesyonel eğitim sunmak amacıyla kuruldu. Deneyimli traderlardan oluşan ekibimiz, 
              yıllarca edindiği bilgi ve tecrübeyi sizlerle paylaşıyor.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Amacımız, her seviyeden yatırımcıya kaliteli eğitim sunarak, Türkiye'de finansal 
              okuryazarlığı artırmak ve başarılı traderlar yetiştirmektir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="premium-card p-6 text-center hover:scale-105 transition-transform"
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-yellow-500">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="premium-card p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6 text-yellow-500 text-center">Eğitmen Ekibimiz</h2>
            <p className="text-gray-300 text-center mb-8 max-w-2xl mx-auto">
              10+ yıllık deneyime sahip profesyonel traderlardan oluşan ekibimiz, 
              sizlere en güncel ve etkili stratejileri öğretiyor.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <img className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" alt="Ahmet Yılmaz - Baş Eğitmen" src="https://images.unsplash.com/photo-1605588722627-818efb8878b9" />
                <h3 className="font-semibold text-lg text-yellow-500">Ahmet Yılmaz</h3>
                <p className="text-gray-400 text-sm">Baş Eğitmen</p>
                <p className="text-gray-500 text-xs mt-2">15 yıllık trading deneyimi</p>
              </div>

              <div className="text-center">
                <img className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" alt="Elif Demir - Teknik Analiz Uzmanı" src="https://images.unsplash.com/photo-1620266757065-5814239881fd" />
                <h3 className="font-semibold text-lg text-yellow-500">Elif Demir</h3>
                <p className="text-gray-400 text-sm">Teknik Analiz Uzmanı</p>
                <p className="text-gray-500 text-xs mt-2">12 yıllık trading deneyimi</p>
              </div>

              <div className="text-center">
                <img className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" alt="Mehmet Kaya - Risk Yönetimi Uzmanı" src="https://images.unsplash.com/photo-1578098576845-51e4ff4305d5" />
                <h3 className="font-semibold text-lg text-yellow-500">Mehmet Kaya</h3>
                <p className="text-gray-400 text-sm">Risk Yönetimi Uzmanı</p>
                <p className="text-gray-500 text-xs mt-2">10 yıllık trading deneyimi</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AboutPage;