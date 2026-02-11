import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, PlayCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

const MyProductsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchMyCourses = async () => {
      if (!user) return;
      
      try {
        // Folosim ruta NOUĂ care trage datele mereu fresh de la server
        const userId = user._id || user.id;
        const response = await fetch(`${API_URL}/my-courses/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setMyCourses(data); // Punem cursurile pe ecran
        }
      } catch (error) {
        console.error("Eroare la preluarea cursurilor:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMyCourses();
  }, [user]);

  if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="w-10 h-10 animate-spin text-yellow-500" /></div>;

  return (
    <>
      <Helmet>
        <title>Ürünlerim - NovaTrader</title>
      </Helmet>

      <div className="container mx-auto px-4 py-20 min-h-[80vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold mb-2">Hoş Geldiniz, <span className="gold-text">{user?.fullName || 'Trader'}</span></h1>
          <p className="text-gray-400 mb-12">Aktif ürünleriniz ve eğitimleriniz</p>

          {myCourses.length === 0 ? (
            <div className="premium-card p-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h2 className="text-2xl font-bold mb-4 text-gray-400">Henüz aktif ürününüz yok</h2>
              <p className="text-gray-500 mb-6">Eğitim kurslarımıza göz atarak öğrenmeye başlayın!</p>
              <Button onClick={() => navigate('/kurslar')} className="gold-gradient text-black font-semibold">
                Kurslara Göz At
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {myCourses.map((course) => (
                <div key={course._id} className="premium-card overflow-hidden flex flex-col border border-yellow-500/30">
                  <img className="w-full h-40 object-cover opacity-80" alt={course.title} src={course.thumbnail} />
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-yellow-500">{course.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 flex-grow">{course.description}</p>
                    <Button onClick={() => navigate(`/kurs/${course._id}`)} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Eğitime Başla
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default MyProductsPage;