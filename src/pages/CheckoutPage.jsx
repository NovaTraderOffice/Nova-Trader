import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const PaymentPage = () => {
  const { courseId } = useParams(); // Luăm ID-ul cursului din URL
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Tragem datele cursului din baza de date
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API_URL}/courses/${courseId}`);
        const data = await res.json();
        setCourse(data);
      } catch (error) {
        console.error("Eroare la preluarea cursului pentru plată:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#0f0f0f]">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!course) {
    return <div className="text-white text-center pt-20">Kurs bulunamadı. (Cursul nu a fost găsit)</div>;
  }

const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          courseId: course._id,
          title: course.title,
          price: course.price,
          userId: user._id || user.id // Trimitem ID-ul userului ca să știm cine plătește
        })
      });

      const data = await response.json();

      // Dacă Stripe ne-a dat link-ul, redirecționăm!
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Eroare la procesarea plății.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Eroare plată:", error);
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Güvenli Ödeme - NovaTrader</title>
      </Helmet>

      <div className="min-h-[80vh] flex flex-col items-center pt-20 pb-12 px-4 bg-[#0f0f0f] text-white">
        
        {/* Titlu Pagină */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gold-text mb-2">Güvenli Ödeme</h1>
          <p className="text-gray-400">Siparişinizi tamamlamak için son bir adım kaldı.</p>
        </div>

        {/* Cardul de Plată */}
        <div className="w-full max-w-md bg-[#121212] border border-yellow-600/30 rounded-xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 text-white border-b border-gray-800 pb-4">Sipariş Özeti</h2>
          
          {/* Detalii Curs dinamic */}
          <div className="flex items-center mb-6">
            <img 
              src={course.thumbnail} 
              alt={course.title} 
              className="w-16 h-16 object-cover rounded-md border border-gray-700 mr-4"
            />
            <div className="flex-grow">
              <h3 className="font-bold text-gray-200">{course.title}</h3>
              <p className="text-xs text-gray-500">
                {course.isBundle ? 'Eğitim Paketi' : 'Tek Seferlik Kurs'}
              </p>
            </div>
            <div className="font-bold text-lg text-yellow-500">
              {course.price}TRY
            </div>
          </div>

          <div className="border-t border-gray-800 pt-4 mb-6">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Toplam Tutar</span>
              <span className="text-yellow-500 text-2xl">{course.price}TRY</span>
            </div>
          </div>

          {/* Buton Plată */}
<Button 
            disabled={isProcessing}
            onClick={handleCheckout}
            className="w-full gold-gradient text-black font-bold text-lg py-6 flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            {isProcessing ? (
               <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
               <>
                 <Lock className="w-5 h-5 mr-2" />
                 Ödemeyi Tamamla
               </>
            )}
          </Button>

          {/* Securitate */}
          <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 mr-1 text-green-600" />
            <span>Tüm işlemler 256-bit SSL şifrelemesi ile korunmaktadır.</span>
          </div>
        </div>

      </div>
    </>
  );
};

export default PaymentPage;