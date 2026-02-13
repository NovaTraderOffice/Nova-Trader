import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// --- IMPORTURI NOI PENTRU VALIDARE ---
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// --- SCHEMA DE VALIDARE (Regulile) ---
const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"), // "Introdu un email valid"
  password: z.string().min(1, "Şifre zorunludur"),             // "Parola e obligatorie"
});

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/urunlerim';

  // --- INITIALIZARE REACT HOOK FORM ---
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  useEffect(() => {
    if (user) {
      navigate('/urunlerim');
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    // 'data' conține deja email și password validate
    const result = await signIn(data.email, data.password);

    if (result.success) {
      toast({
        title: "Tekrar Hoş Geldiniz!",
        description: "Giriş başarılı.",
        className: "bg-green-600 text-white border-none"
      });
      navigate(from, { replace: true });
    } else {
      toast({
        variant: "destructive",
        title: "Hata",
        description: result.error || "Bir şeyler ters gitti.",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Giriş Yap - Nova Trader</title>
      </Helmet>
      <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[80vh]">
        <div className="premium-card p-8 w-full max-w-md bg-[#1a1a1a] border border-yellow-600/20 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-yellow-500">Giriş Yap</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white">E-posta</Label>
              <Input 
                {...register("email")} // Conectăm inputul la formular
                type="email" 
                className={`bg-gray-900 border-gray-700 text-white ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                placeholder="ornek@email.com"
              />
              {/* Mesaj de eroare roșu */}
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-white">Şifre</Label>
                <Link to="/forgot-password" class="text-xs text-yellow-500 hover:underline">Şifremi Unuttum?</Link>
              </div>
              
              <div className="relative">
                <Input 
                  {...register("password")}
                  type={showPassword ? "text" : "password"} 
                  className={`bg-gray-900 border-gray-700 text-white pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Mesaj de eroare roșu */}
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-11 transition-all" 
              disabled={isSubmitting} // Folosim isSubmitting din Hook Form
            >
              {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : 'Giriş Yap'}
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