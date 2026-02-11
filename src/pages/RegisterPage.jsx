import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send, Eye, EyeOff } from 'lucide-react';
import { API_URL, getHeaders } from '@/lib/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [telegramPhone, setTelegramPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [step, setStep] = useState('register');
  const [verificationCode, setVerificationCode] = useState('');

  const BOT_USERNAME = "NovaTrader_SupportBot"; 

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ fullName, email, telegramPhone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationCode(data.verificationCode);
        setStep('verify'); 
        toast({ title: "Hesap oluşturuldu!", description: "Şimdi Telegram üzerinden onaylayın." });
      } else {
        toast({ variant: "destructive", title: "Hata", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Hata", description: "Sunucuya bağlanamadım." });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-screen">
        <div className="premium-card p-8 w-full max-w-md bg-[#1a1a1a] border-2 border-yellow-500/30 text-center rounded-xl">
          <Send className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-white">Telegram Doğrulama</h2>
          <p className="text-gray-400 mb-6">
            Hesabınızı etkinleştirmek ve sinyalleri almak için Telegram'ınızı bağlamanız gerekmektedir.</p>

          <div className="bg-yellow-500/10 p-4 rounded-lg mb-6 border border-yellow-500/20">
            <p className="text-sm text-yellow-500 mb-2 font-bold">AKTİVASYON KODUNUZ:</p>
            <p className="text-4xl font-mono font-black text-white tracking-widest select-all">
              {verificationCode}
            </p>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            1. Botumuzu Açın<br/>
            2. BAŞLAT (START) deyin<br/> 
            3. Yukarıdaki kodu gönderin 
          </p>

          <div className="space-y-3">
            <a 
              href={`https://t.me/${BOT_USERNAME}?start=${verificationCode}`} 
              target="_blank" 
              rel="noreferrer"
              className="block w-full"
            >
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-12">
                Telegram'ı Şimdi Aç
              </Button>
            </a>
            
           <Button 
              variant="outline" 
              className="w-full border-gray-700 text-gray-400 hover:text-white"
              onClick={() => navigate('/giris')}
            >
              Kodu gönderdim, Giriş'e git
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>Kayıt Ol - Nova Trader</title></Helmet>
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="premium-card p-8 w-full max-w-md bg-[#1a1a1a] border border-yellow-600/20 rounded-xl">
          <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">Hesap Oluştur</h1>
          <form onSubmit={handleRegister} className="space-y-5">
            
            <div className="space-y-2">
              <Label className="text-white">Tam Adınız</Label>
              <Input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="bg-gray-900 border-gray-700 text-white" />
            </div>

            <div className="space-y-2">
              <Label className="text-white">E-posta</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-gray-900 border-gray-700 text-white" />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Telefon (Telegram)</Label>
              <Input 
                type="tel" 
                value={telegramPhone} 
                onChange={(e) => setTelegramPhone(e.target.value)} 
                required 
                className="bg-gray-900 border-gray-700 text-white" 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Şifre</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="bg-gray-900 border-gray-700 text-white pr-10" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Devam Et'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-400">
            Zaten hesabın var mı? <Link to="/giris" className="text-yellow-500 hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;