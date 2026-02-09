import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // <--- Importuri Navigare
import { Button } from '@/components/ui/Button';
import { Clock, Star, Zap, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL, getHeaders } from '@/lib/api'; // <--- Import API

const CoursesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- DATELE CURSURILOR (Trebuie să fie aici!) ---
  const courses = [
    {
      id: '1',
      product_key: '1',
      name: 'Temel Borsa Eğitimi',
      description: 'Borsaya sıfırdan başlayanlar için kapsamlı eğitim programı.',
      price: 149,
      rating: 4.8,
      students: 1250,
      duration: '12 saat',
      image: 'https://images.unsplash.com/photo-1620266757065-5814239881fd'
    },
    {
      id: '2',
      product_key: '2',
      name: 'İleri Seviye Trading',
      description: 'Profesyonel trading stratejileri ve teknik analiz eğitimi.',
      price: 249,
      rating: 4.9,
      students: 850,
      duration: '20 saat',
      image: 'https://images.unsplash.com/photo-1620266757065-5814239881fd'
    },
    {
      id: '5',
      product_key: '5',
      name: 'Komple Eğitim Paketi',
      description: 'Tüm kurslarımıza sınırsız erişim ve özel mentorluk.',
      price: 299,
      oldPrice: '398',
      rating: 5.0,
      students: 2100,
      duration: '32 saat',
      isBundle: true,
      image: 'https://images.unsplash.com/photo-1463583723781-ca0bb5b0905f'
    }
  ];

  // --- LOGICA DE CUMPĂRARE ---
  const handleBuyClick = async (course) => {
    // 1. Dacă NU e logat -> Redirect la Login cu memorie
    if (!user) {
      toast({
        title: "Giriş Yapmalısınız",
        description: "Kursu satın almak için lütfen giriş yapın.",
      });
      navigate('/giris', { state: { from: location } });
      return;
    }

    // 2. Dacă E logat -> Inițiem plata (Momentan doar mesaj)
    try {
      console.log("Comandă pentru:", course.name);
      
      // Aici va veni codul de Stripe (decomentezi când e gata backend-ul)
      /*
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ productName: course.name, price: course.price }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      */

      toast({
        title: "🚧 Ödeme Sistemi Bekleniyor",
        description: "Ödeme entegrasyonu yakında eklenecek!",
      });

    } catch (error) {
      console.error("Eroare:", error);
      toast({ variant: "destructive", title: "Eroare", description: "Ceva nu a mers bine." });
    }
  };

  return (
    <>
      <Helmet>
        <title>Kurslar - NovaTrader</title>
        <meta name="description" content="NovaTrader'ın profesyonel borsa ve yatırım eğitim kurslarını keşfedin." />
      </Helmet>

      <div className="bg-[#0f0f0f] text-white">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gold-text">Eğitim Kursları</span>
            </h1>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">
              Profesyonel eğitmenlerimizden öğrenin ve trading becerilerinizi geliştirin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {courses.map((course, index) => (
              course.isBundle 
                ? <BundleCard key={course.id} course={course} index={index} handleBuyClick={handleBuyClick} />
                : <CourseCard key={course.id} course={course} index={index} handleBuyClick={handleBuyClick} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// --- COMPONENTELE CARDURILOR ---

const CourseCard = ({ course, index, handleBuyClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="premium-card overflow-hidden flex flex-col transition-transform hover:scale-105"
  >
    <img className="w-full h-48 object-cover" alt={course.name} src={course.image} />
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-xl font-bold mb-2 text-yellow-500">{course.name}</h3>
      <p className="text-gray-400 mb-4 text-sm flex-grow">{course.description}</p>
      
      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
        <div className="flex items-center"><Clock className="w-4 h-4 mr-1" />{course.duration}</div>
        <div className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500" />{course.rating}</div>
      </div>
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-4">
          <span className="text-3xl font-bold gold-text">{course.price}€</span>
        </div>

        <Button onClick={() => handleBuyClick(course)} className="w-full gold-gradient text-black font-semibold hover:opacity-90">
          Satın Al
        </Button>
      </div>
    </div>
  </motion.div>
);

const BundleCard = ({ course, index, handleBuyClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="premium-card-highlighted overflow-hidden flex flex-col transition-transform hover:scale-105 border-2 border-yellow-500 rounded-2xl relative"
  >
    <div className="absolute top-0 right-0 bg-yellow-500 text-black text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-xl flex items-center gap-1.5">
      <Award className="w-4 h-4" /> EN POPÜLER
    </div>
    <img className="w-full h-48 object-cover" alt={course.name} src={course.image} />
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="text-2xl font-bold mb-2 text-yellow-500">{course.name}</h3>
      <div className="flex items-center bg-yellow-500/10 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mb-3 self-start"><Zap className="w-4 h-4 mr-1" />AVANTAJLI PAKET</div>
      <p className="text-gray-400 mb-4 text-sm flex-grow">{course.description}</p>
      
      <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
        <div className="flex items-center"><Clock className="w-4 h-4 mr-1" />{course.duration}</div>
        <div className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500" />{course.rating}</div>
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-4xl font-bold gold-text">{course.price}€</span>
            <span className="text-gray-500 line-through ml-2 text-lg">{course.oldPrice}€</span>
          </div>
        </div>

        <Button onClick={() => handleBuyClick(course)} className="w-full gold-gradient text-black font-bold text-lg py-6 hover:opacity-90">
          Paketi Satın Al
        </Button>
      </div>
    </div>
  </motion.div>
);

export default CoursesPage;