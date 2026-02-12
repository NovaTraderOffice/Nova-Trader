import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react'; // Importuri comasate
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || '/urunlerim';

  useEffect(() => {
    if (user) {
      navigate('/urunlerim');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn(email, password);

if (result.success) {
      toast({
        title: "Tekrar Hoş Geldiniz!", // Bine ai revenit
        description: "Giriş başarılı.", // Autentificare reusita
        className: "bg-green-600 text-white border-none"
      });
      navigate(from, { replace: true });
    } else {
      toast({
        variant: "destructive",
        title: "Hata", // Eroare
        description: result.error || "Bir şeyler ters gitti.", // Ceva nu a mers bine
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Giriş Yap - Nova Trader</title>
      </Helmet>
      <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[80vh]">
        <div className="premium-card p-8 w-full max-w-md bg-[#1a1a1a] border border-yellow-600/20 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">Giriş Yap</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white">E-posta</Label>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-white">Şifre</Label>
                <Link to="/forgot-password" class="text-xs text-yellow-500 hover:underline">Şifremi Unuttum?</Link>
              </div>
              
              {/* MODIFICAREA ESTE AICI: Wrapper Relative + Buton Toggle */}
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-900 border-gray-700 text-white pr-10" // pr-10 face loc iconitei
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

            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-11" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : 'Giriş Yap'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Hesabınız yok mu?{' '}
            <Link to="/kayit" className="font-medium text-yellow-500 hover:underline">
              Kayıt Olun
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;