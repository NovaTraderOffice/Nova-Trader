
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [telegramPhone, setTelegramPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/urunlerim');
    }
  }, [user, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Lütfen tam adınızı girin.',
      });
      return;
    }
    if (!/^\+[1-9]\d{1,14}$/.test(telegramPhone)) {
      toast({
        variant: 'destructive',
        title: 'Geçersiz Telefon Numarası',
        description: 'Lütfen numaranızı uluslararası formatta girin (örn: +905xxxxxxxxx).',
      });
      return;
    }
    setLoading(true);
    await signUp(email, password, fullName, telegramPhone);
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Kayıt Ol - Nova Trader</title>
        <meta name="description" content="Nova Trader'a ücretsiz kayıt olun ve finansal geleceğinizi şekillendirmeye başlayın." />
      </Helmet>
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="premium-card p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center gold-text">Hesap Oluştur</h1>
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">Tam Adınız</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Adınız Soyadınız"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-gray-900 border-gray-700"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900 border-gray-700"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegramPhone">Telegram Telefon Numaranız</Label>
              <Input
                id="telegramPhone"
                type="tel"
                placeholder="+905xxxxxxxxx"
                value={telegramPhone}
                onChange={(e) => setTelegramPhone(e.target.value)}
                required
                className="bg-gray-900 border-gray-700"
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="bg-gray-900 border-gray-700"
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full gold-gradient text-black font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Kayıt Ol'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-400">
            Zaten bir hesabınız var mı?{' '}
            <Link to="/giris" className="font-medium text-yellow-500 hover:underline">
              Giriş Yapın
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
