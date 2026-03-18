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

  if (!user) {
    return <Navigate to="/giris" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/kurslar" />;
  }

  return children;
};

export default AdminRoute;