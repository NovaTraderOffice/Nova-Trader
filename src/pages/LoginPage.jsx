
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Loader2, LogIn } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/urunlerim');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Giriş Yap - NovaTrader</title>
        <meta name="description" content="Hesabınıza giriş yapın ve özel eğitim içeriklerinize erişin." />
      </Helmet>
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="premium-card p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold gold-text">Giriş Yap</h1>
              <p className="text-gray-400 mt-2">Eğitimlerinize kaldığınız yerden devam edin.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="isim@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white"
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full gold-gradient text-black font-bold text-lg py-3 hover:opacity-90" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
                Giriş Yap
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Hesabınız yok mu?{' '}
                <span onClick={() => navigate('/kayit')} className="font-semibold text-yellow-500 hover:text-yellow-400 cursor-pointer">
                  Hesap Oluşturun
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
