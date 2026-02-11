import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '@/lib/api';
import { Loader2, PlayCircle, CheckCircle } from 'lucide-react';
import Player from '@vimeo/player';
import { useAuth } from '@/contexts/AuthContext';

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Stările pentru securitate și progres
  const [hasAccess, setHasAccess] = useState(false);
  const [progressData, setProgressData] = useState({});
  const iframeRef = useRef(null);

  const getUserId = () => user?._id || user?.id || 'guest';

  // 1. ÎNCĂRCARE CURS + VERIFICARE ACCES LIVE DIN BAZA DE DATE
  useEffect(() => {
    const fetchCourseAndAccess = async () => {
      try {
        const userId = getUserId();

        // A. Tragem datele cursului
        const res = await fetch(`${API_URL}/courses/${courseId}`);
        const data = await res.json();
        setCourse(data);
        
        // B. Verificăm ACCESUL REAL din baza de date
        if (userId !== 'guest') {
          const accessRes = await fetch(`${API_URL}/my-courses/${userId}`);
          const myCourses = await accessRes.json();
          
          const ownsCourse = myCourses.some(c => c._id === courseId);
          setHasAccess(ownsCourse);
        }
        
        // C. Încărcăm progresul (bara galbenă) salvat anterior
        const savedProgress = JSON.parse(localStorage.getItem(`progress_${userId}_${courseId}`)) || {};
        setProgressData(savedProgress);

      } catch (error) {
        console.error("Eroare la încărcare curs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndAccess();
  }, [courseId, user]);

  // 2. LOGICA VIMEO - SALVAREA PROGRESULUI ȘI BARA GALBENĂ
  useEffect(() => {
    let player;

    if (iframeRef.current && course && hasAccess) {
      player = new Player(iframeRef.current);

      player.on('loaded', async () => {
        const savedTime = localStorage.getItem(`time_${getUserId()}_${courseId}_${activeLesson}`);
        if (savedTime) {
          try {
            await player.setCurrentTime(parseFloat(savedTime));
          } catch (e) {
            console.log("Autoplay derulare blocat de browser.");
          }
        }
      });

      player.on('timeupdate', (data) => {
        const percent = Math.round(data.percent * 100);
        const seconds = data.seconds;
        
        if (percent > 0) {
          // Salvăm secunda
          localStorage.setItem(`time_${getUserId()}_${courseId}_${activeLesson}`, seconds);

          // Mișcăm bara galbenă
          setProgressData(prev => {
            if (prev[activeLesson] === percent) return prev; 
            const newData = { ...prev, [activeLesson]: percent };
            localStorage.setItem(`progress_${getUserId()}_${courseId}`, JSON.stringify(newData));
            return newData;
          });
        }
      });
    }

    return () => {
      if (player) {
        player.off('timeupdate');
        player.off('loaded');
      }
    };
  }, [activeLesson, course, user, courseId, hasAccess]); // Adăugat hasAccess la dependențe


  // --- ECRANELE DE AȘTEPTARE ȘI SECURITATE ---
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-yellow-500"><Loader2 className="animate-spin w-10 h-10"/></div>;
  if (!course) return <div className="text-white text-center pt-20">Kurs bulunamadı.</div>;

  // Dacă nu are cursul în baza de date, îi dăm "Jet" :)
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] text-white pt-20 px-4">
        <div className="premium-card p-10 text-center max-w-md border-red-500/30 border">
          <h2 className="text-2xl font-bold mb-4 text-red-500">Erişim Engellendi (Acces Interzis)</h2>
          <p className="text-gray-400 mb-6">Bu kursu izlemek için önce satın almalısınız.</p>
          <button onClick={() => navigate('/kurslar')} className="w-full gold-gradient text-black font-bold py-3 px-6 rounded-md">
            Kurslara Git (Mergi la Magazin)
          </button>
        </div>
      </div>
    );
  }

  // Trucul magic pentru Vimeo
  const getCustomVimeoUrl = (rawUrl) => {
    if(!rawUrl) return "";
    let embedUrl = rawUrl;
    if (rawUrl.includes('vimeo.com') && !rawUrl.includes('player.vimeo.com')) {
      const videoId = rawUrl.split('/').pop(); 
      embedUrl = `https://player.vimeo.com/video/${videoId}`;
    }
    const separator = embedUrl.includes('?') ? '&' : '?';
    return `${embedUrl}${separator}color=d4af37&title=0&byline=0&portrait=0&badge=0&dnt=1`;
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-10 px-4">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PARTEA STANGA: VIDEO */}
        <div className="lg:col-span-2">
          <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-yellow-600/20">
             {course.lessons.length > 0 ? (
                <iframe 
                  key={activeLesson}
                  ref={iframeRef}
                  src={getCustomVimeoUrl(course.lessons[activeLesson]?.videoUrl)} 
                  className="w-full h-full"
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture" 
                  allowFullScreen
                ></iframe>
             ) : (
                <div className="flex items-center justify-center h-full text-gray-500">Video yok.</div>
             )}
          </div>
          <h1 className="text-3xl font-bold text-yellow-500 mt-6">{course.lessons[activeLesson]?.title || "İçerik"}</h1>
          <p className="text-gray-400 mt-2">{course.description}</p>
        </div>

        {/* PARTEA DREAPTA: LISTA DE LECȚII */}
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 h-[600px] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Ders İçeriği</h3>
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => {
              const currentProgress = progressData[index] || 0;
              const isFinished = currentProgress > 95; 

              return (
                <div key={index} className="flex flex-col">
                  <button
                    onClick={() => setActiveLesson(index)}
                    className={`w-full flex items-center p-4 rounded-t-lg transition-all text-left border-x border-t ${
                      activeLesson === index 
                        ? "bg-yellow-500 text-black border-yellow-500 font-bold" 
                        : "bg-gray-900 text-gray-300 border-gray-800 hover:bg-gray-800"
                    }`}
                  >
                    {isFinished ? (
                      <CheckCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${activeLesson === index ? "text-black" : "text-green-500"}`} />
                    ) : (
                      <PlayCircle className={`w-5 h-5 mr-3 flex-shrink-0 ${activeLesson === index ? "text-black" : "text-yellow-500"}`} />
                    )}
                    <span className="text-sm truncate">{lesson.title}</span>
                    <span className="ml-auto text-xs opacity-70 bg-black/20 px-2 py-1 rounded">{lesson.duration}</span>
                  </button>
                  
                  {/* BARA GALBENĂ */}
                  <div className="w-full h-1.5 bg-gray-800 rounded-b-lg overflow-hidden border-x border-b border-gray-800">
                    <div 
                      className="h-full bg-yellow-500 transition-all duration-300 ease-linear"
                      style={{ width: `${currentProgress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CoursePlayerPage;