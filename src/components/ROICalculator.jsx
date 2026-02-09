import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Calculator } from 'lucide-react';

const ROICalculator = () => {
  const [investment, setInvestment] = useState(1000);
  
  const monthlyProfit = Math.floor(investment * 0.35);
  const yearlyProfit = Math.floor(investment * 0.35 * 12);
  const totalBalance = investment + yearlyProfit;

  return (
    <div className="w-full max-w-3xl mx-auto my-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Potansiyel <span className="gold-text">Kazanç Hesaplayıcı</span></h2>
        <p className="text-gray-400">Yatırımınızın VIP sinyallerimizle ne kadar büyüyebileceğini hesaplayın.</p>
      </div>

      <div className="premium-card p-8 bg-gradient-to-b from-[#1a1a1a] to-black border border-yellow-500/30">
        
        <div className="mb-10">
          <label className="flex justify-between text-gray-300 mb-4 font-semibold">
            <span>Başlangıç Yatırımı</span>
            <span className="text-yellow-500 text-xl font-bold">{investment}€</span>
          </label>
          <input 
            type="range" 
            min="100" 
            max="10000" 
            step="100"
            value={investment}
            onChange={(e) => setInvestment(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>100€</span>
            <span>10.000€</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-[#0f0f0f] p-4 rounded-xl border border-gray-800 text-center">
            <p className="text-gray-400 text-sm mb-1">Aylık Tahmini Kazanç</p>
            <p className="text-2xl font-bold text-green-500 flex justify-center items-center">
              + {monthlyProfit}€
            </p>
          </div>

          <div className="bg-[#0f0f0f] p-4 rounded-xl border border-gray-800 text-center">
            <p className="text-gray-400 text-sm mb-1">Yıllık Tahmini Kazanç</p>
            <p className="text-2xl font-bold text-green-500 flex justify-center items-center">
              + {yearlyProfit}€
            </p>
          </div>

          <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/30 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-1 opacity-20">
              <TrendingUp className="w-12 h-12 text-yellow-500" />
            </div>
            <p className="text-yellow-500 text-sm mb-1 font-bold">Yıl Sonu Toplam Bakiye</p>
            <p className="text-3xl font-black text-white">
              {totalBalance}€
            </p>
          </div>

        </div>

        <p className="text-xs text-gray-600 text-center mt-6 italic">
          * Hesaplamalar geçmiş performansa (%35/ay) dayanmaktadır. Piyasalar değişkendir, kesin kazanç garantisi verilmez.
        </p>

      </div>
    </div>
  );
};

export default ROICalculator;