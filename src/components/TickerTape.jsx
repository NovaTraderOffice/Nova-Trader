import React, { useState, useEffect } from 'react';

const TickerTape = () => {
  const [items, setItems] = useState([
    { symbol: "BTC", price: "...", change: "...", up: true },
    { symbol: "ETH", price: "...", change: "...", up: true },
    { symbol: "SOL", price: "...", change: "...", up: true },
    { symbol: "GOLD", price: "2410.50", change: "+0.2%", up: true },
    { symbol: "NASDAQ", price: "18400.00", change: "+1.2%", up: true },
    { symbol: "EUR/USD", price: "1.0850", change: "-0.1%", up: false },
  ]);

  const fetchCryptoPrices = async () => {
    try {
      //API-ul CoinGecko
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await response.json();

      const newCryptoData = [
        { 
          symbol: "BTC", 
          price: `$${data.bitcoin.usd.toLocaleString()}`, 
          change: `${data.bitcoin.usd_24h_change.toFixed(2)}%`, 
          up: data.bitcoin.usd_24h_change > 0 
        },
        { 
          symbol: "ETH", 
          price: `$${data.ethereum.usd.toLocaleString()}`, 
          change: `${data.ethereum.usd_24h_change.toFixed(2)}%`, 
          up: data.ethereum.usd_24h_change > 0 
        },
        { 
          symbol: "SOL", 
          price: `$${data.solana.usd.toLocaleString()}`, 
          change: `${data.solana.usd_24h_change.toFixed(2)}%`, 
          up: data.solana.usd_24h_change > 0 
        },
      ];

      const simulatedStocks = [
        { 
          symbol: "GOLD", 
          price: `$${(2410 + Math.random() * 2).toFixed(2)}`, 
          change: "+0.3%", 
          up: true 
        },
        { 
          symbol: "NASDAQ", 
          price: `${(18400 + Math.random() * 10).toFixed(0)}`, 
          change: "+1.1%", 
          up: true 
        },
        { 
          symbol: "EUR/USD", 
          price: `${(1.0850 + Math.random() * 0.0005).toFixed(4)}`, 
          change: "-0.1%", 
          up: false 
        },
      ];

      setItems([...newCryptoData, ...simulatedStocks]);

    } catch (error) {
      console.error("Eroare la preluarea prețurilor:", error);
    }
  };

  useEffect(() => {
    fetchCryptoPrices();

    const interval = setInterval(fetchCryptoPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-yellow-500 text-black text-xs font-bold py-3 overflow-hidden z-[60] border-t border-yellow-600 shadow-lg">
      <div className="flex w-max animate-ticker hover:pause">
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center mx-6 space-x-2 whitespace-nowrap">
            <span className="font-black">{item.symbol}</span>
            <span>{item.price}</span>
            <span className={`flex items-center ${item.up ? "text-green-900" : "text-red-900"}`}>
              {item.up ? "▲" : "▼"} {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TickerTape;