import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Phone, Save, Edit2, Loader2, ShieldCheck, CreditCard, Star } from 'lucide-react';
import { API_URL, getHeaders } from '@/lib/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false); // Pentru butonul de abonament

  const [fullName, setFullName] = useState(user?.fullName || '');

  const handleSave = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${API_URL}/profile`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
          email: user.email,
          telegramPhone: user.telegramPhone,
          fullName: fullName
        }),
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data.user);
        setIsEditing(false);
        toast({ 
            title: "Başarılı!", 
            description: "Profil güncellendi.",
            className: "bg-green-600 text-white border-none" 
        });
      } else {
        toast({ variant: "destructive", title: "Hata", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Hata", description: "Sunucu hatası." });
    } finally {
      setLoading(false);
    }
  };

  // Funcția pentru gestionarea abonamentului Stripe
  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const response = await fetch(`${API_URL}/subscriptions/create-portal-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }) // sau user._id, depinde cum e în contextul tău
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // Redirecționare spre Stripe Portal
      } else {
        toast({ variant: "destructive", title: "Hata", description: data.error || "Nu s-a putut deschide portalul." });
      }
    } catch (error) {
      console.error("Eroare rețea:", error);
      toast({ variant: "destructive", title: "Hata", description: "A apărut o eroare de conexiune." });
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <>
      <Helmet><title>Profilim - Nova Trader</title></Helmet>
      
      <div className="container mx-auto px-4 py-20 min-h-[80vh] flex flex-col items-center">
        <div className="w-full max-w-2xl">
          
          {/* CARD PROFIL PERSONAL */}
          <div className="premium-card p-8 bg-[#1a1a1a] border border-yellow-600/20 rounded-xl relative overflow-hidden mb-8">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-600 to-yellow-300" />
            
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-yellow-500">Profilim</h1>
              <Button 
                variant="ghost" 
                onClick={() => setIsEditing(!isEditing)}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                {isEditing ? 'İptal' : <><Edit2 className="w-4 h-4 mr-2" /> Düzenle</>}
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-yellow-500" /> Ad Soyad
                </Label>
                {isEditing ? (
                  <Input 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white focus:border-yellow-500"
                  />
                ) : (
                  <p className="text-xl text-white font-medium pl-1 border-b border-transparent py-2">{user?.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-yellow-500" /> E-posta
                </Label>
                <div className="p-3 bg-gray-900/50 rounded-md border border-gray-800 text-gray-500 cursor-not-allowed flex items-center justify-between">
                  <span>{user?.email}</span>
                  <ShieldCheck className="w-4 h-4 text-green-500/50" />
                </div>
                {isEditing && <p className="text-xs text-gray-600">Güvenlik nedeniyle e-posta değiştirilemez.</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-yellow-500" /> Telegram Numarası
                </Label>
                
                <div className="p-3 bg-gray-900/50 rounded-md border border-gray-800 text-gray-500 cursor-not-allowed flex items-center justify-between">
                  <span>{user?.telegramPhone || 'Bağlı Değil'}</span>
                  {user?.telegramPhone && <ShieldCheck className="w-4 h-4 text-green-500/50" />}
                </div>

                {isEditing && (
                  <p className="text-xs text-gray-600">
                    Numara değiştirilemez. Bot bağlantısı için sabittir.
                  </p>
                )}
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-gray-800 flex justify-end">
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold transition-all hover:scale-105"
                  >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              )}

            </div>
          </div>

          {/* CARD ABONAMENT VIP */}
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
            
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <h2 className="text-xl font-bold text-white">VIP Abonelik</h2>
            </div>

            <div className="bg-black/30 p-6 rounded-lg border border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
              
              <div className="w-full md:w-auto text-center md:text-left">
                {user?.subscriptionStatus === 'active' ? (
                  <>
                    <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-green-500 font-bold uppercase tracking-widest text-sm">Aktif</span>
                    </div>
                    <p className="text-gray-400 text-sm">VIP Telegram grubuna tam erişiminiz var.</p>
                  </>
                ) : (
                  <>
                     <span className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-2 block">Pasif</span>
                     <p className="text-gray-400 text-sm">Şu anda aktif bir aboneliğiniz bulunmuyor.</p>
                  </>
                )}
              </div>

              <div className="w-full md:w-auto shrink-0">
                <Button 
                  onClick={handleManageSubscription}
                  disabled={loadingPortal}
                  variant="outline"
                  className="w-full md:w-auto border-gray-700 text-white hover:text-yellow-500 hover:border-yellow-500 transition-all bg-[#1a1a1a]"
                >
                  {loadingPortal ? (
                    <Loader2 className="w-4 h-4 animate-spin text-yellow-500 mr-2" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  Aboneliği Yönet
                </Button>
              </div>
              
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ProfilePage;