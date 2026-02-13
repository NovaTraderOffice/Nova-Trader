import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, PlayCircle } from 'lucide-react';
import { Skeleton } from "@/components/ui/Skeleton"; // Import Skeleton

// --- SKELETON PERSONALIZAT (Identic cu Cardul tău) ---
const CourseSkeleton = () => (
  <div className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 shadow-lg h-full flex flex-col">
    {/* Imagine Skeleton */}
    <Skeleton className="h-48 w-full bg-gray-800" />
    
    <div className="p-6 flex flex-col flex-grow space-y-4">
      {/* Titlu Skeleton */}
      <Skeleton className="h-8 w-3/4 bg-gray-700" />
      
      {/* Descriere Skeleton (3 linii) */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full bg-gray-800" />
        <Skeleton className="h-4 w-5/6 bg-gray-800" />
        <Skeleton className="h-4 w-4/6 bg-gray-800" />
      </div>

      {/* Footer cu Preț și Buton */}
      <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
        <Skeleton className="h-8 w-20 bg-gray-800" />
        <Skeleton className="h-10 w-32 rounded-lg bg-gray-700" />
      </div>
    </div>
  </div>
);

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Poți lăsa timeout-ul mic dacă vrei să vezi efectul, 
        // altfel scoate-l pentru viteză maximă în producție
        // await new Promise(resolve => setTimeout(resolve, 800));

        const response = await api.get('/courses');
        setCourses(response.data);
      } catch (error) {
        toast({
          title: "Hata",
          description: "Kurslar yüklenemedi.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [toast]);

  const handleCourseClick = (courseId, isPurchased) => {
    if (isPurchased) {
      navigate(`/kurs/${courseId}`);
    } else {
      navigate(`/odeme/${courseId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Eğitim Programlarımız
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Finansal özgürlüğe giden yolda size rehberlik edecek kapsamlı eğitimler.
          </p>
        </div>

        {loading ? (
          // --- AICI ESTE SCHIMBAREA: Skeleton Grid ---
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CourseSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const isPurchased = user?.purchasedCourses?.includes(course._id) || user?.role === 'admin';
              
              return (
                <div 
                  key={course._id} 
                  className="group bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)] flex flex-col h-full"
                >
                  {/* Imagine */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={course.thumbnail || "/api/placeholder/400/320"} 
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-60" />
                    
                    {/* Badge VIP/Free */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {course.price > 0 ? 'PREMIUM' : 'GRATUIT'}
                      </span>
                    </div>
                  </div>

                  {/* Continut */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">
                      {course.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
                      <div className="text-2xl font-bold text-white">
                        {course.price === 0 ? "Ücretsiz" : `€${course.price}`}
                      </div>
                      
                      <Button 
                        onClick={() => handleCourseClick(course._id, isPurchased)}
                        className={`gap-2 ${isPurchased 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-yellow-500 hover:bg-yellow-600 text-black'}`}
                      >
                        {isPurchased ? (
                          <>
                            <PlayCircle className="w-4 h-4" />
                            İzle
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            Satın Al
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;