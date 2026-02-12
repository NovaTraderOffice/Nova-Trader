import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '@/lib/api';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Luăm tokenul din URL
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: "Eroare", description: "Şifreler eşleşmiyor!" });
      return;
    }

    if (password.length < 6) {
        toast({ variant: "destructive", title: "Eroare", description: "Parola en az 6 karakterden oluşmalıdır." });
        return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ 
            title: "Başarı!", 
            description: "Parolanız değiştirildi. Şimdi giriş yapabilirsiniz.",
            className: "bg-green-600 text-white border-none"
        });
        // Redirecționăm la login după 2 secunde
        setTimeout(() => navigate('/giris'), 2000);
      } else {
        toast({ variant: "destructive", title: "Bağlantının Süresi Doldu", description: data.message || "Bağlantı geçersiz veya süresi dolmuş." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Hata", description: "Sunucu hatası." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Yeni Şifre - Nova Trader</title></Helmet>
      <div className="container mx-auto px-4 py-20 min-h-[80vh] flex items-center justify-center">
        <div className="premium-card p-8 w-full max-w-md bg-[#1a1a1a] border border-yellow-600/20 rounded-xl relative">
          
          <h1 className="text-2xl font-bold mb-6 text-white text-center">Yeni Şifre Belirle</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label className="text-gray-300">Yeni Şifre</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-10 pr-10 bg-gray-900 border-gray-700 text-white focus:border-yellow-500" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Şifreyi Onayla</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <Input 
                  type="password"
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  className="pl-10 bg-gray-900 border-gray-700 text-white focus:border-yellow-500" 
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12 mt-4" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : 'Schimbă Parola'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;