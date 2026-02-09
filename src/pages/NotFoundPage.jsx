import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { TrendingDown } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-[#0f0f0f] text-white">
      <TrendingDown className="w-24 h-24 text-red-500 mb-6" />
      <h1 className="text-6xl font-bold text-yellow-500 mb-2">404</h1>
      <h2 className="text-2xl font-bold mb-4">Piyasa Çöktü... ya da sayfa yok!</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Likidasyon bölgesine girmiş gibisiniz. Aradığınız sayfa listeden çıkarılmış ya da hiç var olmamış.
      </p>
      <Link to="/">
        <Button className="bg-yellow-500 text-black font-bold hover:bg-yellow-400">
          Güvenli Bölgeye Dön (Ana Sayfa)
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;