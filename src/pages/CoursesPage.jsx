import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Clock, Star, Zap, Award, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

const CoursesPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/courses`);
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Eroare:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

const handleBuyClick = (course) => {
    if (!user) {
      toast({ title: "Giriş Yapmalısınız", description: "Kursu satın almak için lütfen giriş yapın." });
      navigate('/giris', { state: { from: location } });
      return;
    }
    
    navigate(`/odeme/${course._id}`); 
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-yellow-500">
      <Loader2 className="w-12 h-12 animate-spin" />
    </div>
  );

  return (
    <>
      <Helmet><title>Kurslar - NovaTrader</title></Helmet>
      <div className="bg-[#0f0f0f] text-white min-h-screen py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4"><span className="gold-text">Eğitim Kursları</span></h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <CourseCard key={course._id} course={course} index={index} handleBuyClick={handleBuyClick} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const CourseCard = ({ course, index, handleBuyClick }) => {
  const isComingSoon = !course.isAvailable;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: index * 0.1 }} 
      className={`premium-card overflow-hidden flex flex-col transition-all duration-300 relative ${
        isComingSoon ? 'opacity-60 grayscale cursor-not-allowed border-gray-800' : 'hover:scale-105 border-yellow-600/20'
      }`}
    >
      {/* Insigna de YAKINDA (Coming Soon) */}
      {isComingSoon && (
        <div className="absolute top-4 left-4 z-10 bg-black/90 text-yellow-500 text-xs font-bold px-3 py-1.5 rounded border border-yellow-500 uppercase tracking-wider shadow-lg">
          Yakında
        </div>
      )}

      <img className="w-full h-48 object-cover" alt={course.title} src={course.thumbnail} />
      
      <div className="p-6 flex flex-col flex-grow relative">
        <h3 className={`text-xl font-bold mb-2 ${isComingSoon ? 'text-gray-400' : 'text-yellow-500'}`}>
          {course.title}
        </h3>
        <p className={`text-sm mb-4 flex-grow ${isComingSoon ? 'text-gray-500' : 'text-gray-400'}`}>
          {course.description}
        </p>
        
        <div className={`flex items-center space-x-4 mb-4 text-sm ${isComingSoon ? 'text-gray-600' : 'text-gray-400'}`}>
          <div className="flex items-center"><Clock className="w-4 h-4 mr-1" />{course.lessons?.length || 0} Ders</div>
          <div className="flex items-center"><Star className={`w-4 h-4 mr-1 ${isComingSoon ? 'text-gray-600' : 'text-yellow-500'}`} />5.0</div>
        </div>
        
        <div className="mt-auto">
          <span className={`text-3xl font-bold block mb-4 ${isComingSoon ? 'text-gray-500' : 'gold-text'}`}>
            {course.price}TRY
          </span>
          <Button 
            disabled={isComingSoon}
            onClick={() => !isComingSoon && handleBuyClick(course)} 
            className={`w-full font-semibold transition-all ${
              isComingSoon 
                ? 'bg-gray-800 text-gray-500 border border-gray-700 hover:bg-gray-800 cursor-not-allowed' 
                : 'gold-gradient text-black hover:opacity-90'
            }`}
          >
            {isComingSoon ? 'Yakında Gelecek' : 'Satın Al'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CoursesPage;