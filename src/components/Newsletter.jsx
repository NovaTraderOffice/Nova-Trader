import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);

    // Simulăm un request la server
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      toast({
        title: "Kayıt Başarılı! 🎉",
        description: "Haftalık bültenimize hoş geldiniz.",
        className: "bg-green-600 text-white border-none"
      });
      setEmail('');
    }, 1500);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-[#1a1a1a] border border-yellow-500/30 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl">
          
          <div className="inline-flex p-4 bg-yellow-500/10 rounded-full mb-6">
            <Mail className="w-8 h-8 text-yellow-500" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Piyasa Fırsatlarını <span className="gold-text">Kaçırmayın</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">
            Her Pazartesi sabahı haftalık piyasa analizi, özel coin sepetleri ve trading ipuçları e-posta kutunuzda. Ücretsiz katılın.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
              <Input 
                type="email" 
                placeholder="E-posta adresiniz" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black/50 border-gray-700 text-white h-12 focus:border-yellow-500"
                required
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="h-12 px-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold whitespace-nowrap"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Abone Ol'}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center text-green-500 bg-green-500/10 p-6 rounded-xl border border-green-500/20 max-w-lg mx-auto animate-in fade-in zoom-in duration-500">
              <CheckCircle className="w-12 h-12 mb-2" />
              <h3 className="text-xl font-bold">Aramıza Hoş Geldin!</h3>
              <p className="text-green-400/80">İlk analiz raporu Pazartesi sabahı elinde olacak.</p>
            </div>
          )}

          <p className="text-xs text-gray-600 mt-6">
            * Spam yok. İstediğiniz zaman tek tıkla abonelikten çıkabilirsiniz.
          </p>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;