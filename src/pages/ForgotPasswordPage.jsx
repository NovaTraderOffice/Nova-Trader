import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { API_URL } from '@/lib/api';

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast({ 
          title: "Email trimis!", 
          description: "Verifică-ți inbox-ul (și spam-ul) pentru link-ul de resetare.",
          className: "bg-green-600 text-white border-none"
        });
      } else {
        toast({ variant: "destructive", title: "Hata", description: data.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Hata", description: "Nu am putut conecta la server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Resetare Parolă - Nova Trader</title></Helmet>
      <div className="container mx-auto px-4 py-20 min-h-[80vh] flex items-center justify-center">
        <div className="premium-card p-8 w-full max-w-md bg-[#1a1a1a] border border-yellow-600/20 rounded-xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 to-yellow-300" />

          {!submitted ? (
            <>
              <h1 className="text-2xl font-bold mb-2 text-white">Ți-ai uitat parola?</h1>
              <p className="text-gray-400 mb-6 text-sm">Nu-ți face griji. Scrie emailul mai jos și îți trimitem instrucțiunile.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                    <Input 
                      type="email" 
                      placeholder="nume@exemplu.com"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className="pl-10 bg-gray-900 border-gray-700 text-white focus:border-yellow-500" 
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-12" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Trimite Link Resetare'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Verifică-ți Emailul</h2>
              <p className="text-gray-400 mb-6">Am trimis un link de resetare către <span className="text-yellow-500">{email}</span></p>
              <Button variant="outline" onClick={() => setSubmitted(false)} className="border-gray-700 text-gray-300">
                Nu ai primit? Trimite iar
              </Button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/giris" className="text-sm text-gray-500 hover:text-white flex items-center justify-center gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Înapoi la Autentificare
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;