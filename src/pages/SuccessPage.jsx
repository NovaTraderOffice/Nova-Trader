import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle, Loader2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, fetchUserData } = useAuth(); // fetchUserData ca să actualizăm userul local
  
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      const courseId = searchParams.get('course_id');

      if (!sessionId || !courseId || !user) return;

      try {
        const res = await fetch(`${API_URL}/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            courseId,
            userId: user._id || user.id
          })
        });

        const data = await res.json();

        if (data.success) {
          // Reîncărcăm datele utilizatorului ca să apară instant cursul nou
          if (fetchUserData) await fetchUserData();
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error("Eroare:", error);
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams, user]);

  return (
    <>
      <Helmet><title>Ödeme Başarılı - NovaTrader</title></Helmet>
      <div className="min-h-[80vh] flex items-center justify-center bg-[#0f0f0f] text-white px-4">
        <div className="premium-card p-10 max-w-lg w-full text-center border-green-500/30">
          
          {status === 'verifying' && (
            <div className="flex flex-col items-center">
              <Loader2 className="w-16 h-16 animate-spin text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Ödemeniz Onaylanıyor...</h2>
              <p className="text-gray-400">Lütfen bekleyin, kursunuz hesabınıza tanımlanıyor.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
              <h2 className="text-3xl font-bold mb-2 text-white">Tebrikler!</h2>
              <p className="text-gray-400 mb-8">
                Ödemeniz başarıyla alındı ve kurs hesabınıza eklendi. Hemen öğrenmeye başlayabilirsiniz!
              </p>
              <Button 
                onClick={() => window.location.href = '/urunlerim'} 
                className="w-full gold-gradient text-black font-bold text-lg py-6"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Ürünlerim'e Git (Mergi la Cursurile Mele)
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4 text-3xl">X</div>
              <h2 className="text-2xl font-bold mb-2 text-red-500">Bir Hata Oluştu</h2>
              <p className="text-gray-400 mb-6">Ödemeniz doğrulanamadı. Destek ile iletişime geçin.</p>
              <Button onClick={() => navigate('/iletisim')} variant="outline" className="border-gray-700 text-white">
                Destek Ekibine Ulaş
              </Button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default SuccessPage;