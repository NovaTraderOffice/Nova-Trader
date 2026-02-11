import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("Datele utilizatorului sunt:", user);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]"><Loader2 className="w-10 h-10 animate-spin text-yellow-500" /></div>;
  }

  // Dacă nu e logat deloc, îl trimitem la login
  if (!user) {
    return <Navigate to="/giris" />;
  }

  // Dacă e logat, dar NU are grad de admin, îl trimitem înapoi la cursuri
  if (user.role !== 'admin') {
    return <Navigate to="/kurslar" />;
  }

  // Dacă totul e ok, îl lăsăm să intre în pagina de Admin
  return children;
};

export default AdminRoute;