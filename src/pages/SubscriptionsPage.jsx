import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Check, Star, Send, Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/api';

const SubscriptionsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    // Dacă nu e logat, îl trimitem la login
    if (!user) {
      navigate('/giris');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/subscriptions/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      const data = await response.json();

      if (data.url) {
        // Redirecționăm către pagina sigură de la Stripe
        window.location.href = data.url;
      } else {
        console.error("Eroare de la server:", data.error);
        alert("A apărut o problemă la procesarea plății. Te rugăm să încerci din nou.");
      }
    } catch (error) {
      console.error("Eroare rețea:", error);
      alert("Nu s-a putut conecta la server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>VIP Abonelik - NovaTrader</title></Helmet>
      
      <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 relative overflow-hidden">
        {/* Glow de fundal */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-yellow-600/10 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">
              VIP <span className="gold-text">TELEGRAM</span> GRUBU
            </h1>
            <p className="text-gray-400 text-lg md:text-xl">
              Profesyonel analizler, anlık sinyaller ve piyasa öngörüleri ile bir adım önde olun. Sadece elit yatırımcılar için.
            </p>
          </div>

          <div className="flex justify-center">
            {/* CARD ABONAMENT */}
            <div className="w-full max-w-md bg-[#121212] border border-yellow-500/30 rounded-3xl p-8 shadow-2xl shadow-yellow-500/10 relative transform transition hover:-translate-y-2 hover:border-yellow-500/60 duration-300">
              
              {/* Badge Pop-up */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-1.5 rounded-full font-black text-sm uppercase tracking-widest flex items-center shadow-lg">
                <Star className="w-4 h-4 mr-1 fill-black" /> En Popüler
              </div>

              <div className="text-center mb-8 pt-4">
                <h2 className="text-2xl font-bold mb-2">Aylık VIP Erişim</h2>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-5xl font-black text-white">€80</span>
                  <span className="text-gray-500 font-bold mt-4">/ay</span>
                </div>
                <p className="text-sm text-gray-500 mt-3 font-medium">İstediğiniz zaman iptal edebilirsiniz.</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "Günlük Al/Sat Sinyalleri",
                  "Canlı Piyasa Analizi",
                  "Özel Coin İncelemeleri",
                  "Risk Yönetimi Stratejileri",
                  "Doğrudan Eğitmen Desteği",
                  "Özel VIP Topluluğu"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="p-1 bg-yellow-500/10 rounded-full">
                      <Check className="w-4 h-4 text-yellow-500" />
                    </div>
                    <span className="text-gray-300 font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={handleSubscribe}
                disabled={loading}
                className="w-full gold-gradient text-black font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="w-6 h-6 animate-spin mr-2" /> İşleniyor...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> ŞİMDİ KATIL</>
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center text-gray-500 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 mr-1" /> %100 Güvenli Ödeme (Stripe)
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SubscriptionsPage;