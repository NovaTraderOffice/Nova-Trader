import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth(); // Ca să actualizăm profilul direct
  const [status, setStatus] = useState('loading'); // loading, success, error
  
  // Ref pentru a preveni apelarea dublă în React Strict Mode
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      const sessionId = searchParams.get('session_id');
      const courseId = searchParams.get('course_id'); // la abonament va fi null

      if (!sessionId) {
        setStatus('error');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            courseId,
            userId: user?.id || user?._id
          })
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          
          // Dacă e curs, merge la Urunlerim. Dacă e abonament, la Profil
          setTimeout(() => {
            if (courseId) {
              navigate('/urunlerim');
            } else {
              // Dacă a luat abonament, dăm un refresh mic ca să-i apară activ în profil
              window.location.href = '/profil'; 
            }
          }, 3000);
          
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error("Eroare la verificare:", error);
        setStatus('error');
      }
    };

    // Apelăm verificarea doar dacă userul s-a încărcat
    if (user) {
      verifyPayment();
    }
  }, [searchParams, navigate, user]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white p-4">
      <div className="bg-[#121212] p-8 md:p-12 rounded-3xl border border-gray-800 text-center max-w-md w-full shadow-2xl">
        
        {status === 'loading' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <Loader2 className="w-20 h-20 animate-spin text-yellow-500 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Ödemeniz Onaylanıyor...</h2>
            <p className="text-gray-400">Lütfen sayfayı kapatmayın veya yenilemeyin.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-2">Ödeme Başarılı!</h2>
            <p className="text-gray-400 mb-6">İşleminiz tamamlandı. Yönlendiriliyorsunuz...</p>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-full animate-[shrink_3s_linear_forwards]" />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <XCircle className="w-20 h-20 text-red-500 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Ödeme Doğrulanamadı</h2>
            <p className="text-gray-400 mb-8">Bir hata oluştu veya ödeme tamamlanmadı. Lütfen destek ile iletişime geçin.</p>
            <button 
              onClick={() => navigate('/')} 
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition-colors"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessPage;