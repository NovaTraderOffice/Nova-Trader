import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ExternalLink, BarChart2, Briefcase, Zap, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const newImageUrl = "https://horizons-cdn.hostinger.com/dc9b4162-1bbf-4707-8c44-a1438cae6f40/fd33369c0a9b35b33aa6fd8809a8022f.png";

const tools = [
  {
    name: 'Finviz',
    description: 'Finviz, yatırımcılar için en iyi hisse senedi tarayıcılarından biridir. Akıllı alım satım kararları için gelişmiş filtreler, gerçek zamanlı piyasa haritaları ve haber entegrasyonu sunar.',
    link: 'https://finviz.com',
    image: newImageUrl,
    icon: <BarChart2 className="w-6 h-6 text-yellow-500" />,
    buttonText: 'Finviz\'i Ziyaret Et'
  },
  {
    name: 'TradeZero',
    description: 'TradeZero, günlük yatırımcılar için tasarlanmış güçlü bir doğrudan erişimli aracı kurumdur. Sıfır komisyonlu alım satım, açığa satış olanakları ve ışık hızında emir gerçekleştirme sağlar.',
    link: 'https://www.tradezero.co',
    image: newImageUrl,
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    buttonText: 'TradeZero\'yu Keşfet'
  },
  {
    name: 'TradingView',
    description: 'TradingView, etkileşimli grafikler, teknik göstergeler ve canlı topluluk fikirleri sunan dünyanın lider grafik platformudur. Profesyonel analiz ve strateji geliştirme için mükemmeldir.',
    link: 'https://www.tradingview.com',
    image: newImageUrl,
    icon: <BarChart2 className="w-6 h-6 text-yellow-500" />,
    buttonText: 'TradingView\'e Git'
  },
  {
    name: 'ICMarkets',
    description: 'ICMarkets, düşük spreadler ve derin likidite sunan güvenilir bir küresel aracı kurumdur. US30, Forex ve CFD\'leri hassasiyet ve şeffaflıkla alıp satmak için idealdir.',
    link: 'https://www.icmarkets.com',
    image: newImageUrl,
    icon: <Briefcase className="w-6 h-6 text-yellow-500" />,
    buttonText: 'ICMarkets\'ı Aç'
  },
  {
    name: 'OANDA',
    description: 'OANDA, US30 dahil olmak üzere küresel endekslere erişim sunan düzenlenmiş bir aracı kurumdur. Güvenilirliği, güçlü müşteri koruması ve profesyonel analizleriyle tanınır.',
    link: 'https://www.oanda.com',
    image: newImageUrl,
    icon: <Briefcase className="w-6 h-6 text-yellow-500" />,
    buttonText: 'OANDA\'yı Ziyaret Et'
  }
];

const TradingToolsPage = () => {
  return (
    <>
      <Helmet>
        <title>Temel Alım Satım Araçları - Nova Trader</title>
        <meta name="description" content="Profesyonel yatırımcılar tarafından kullanılan en iyi alım satım araçlarını, yazılımlarını ve en iyi aracı kurumları keşfedin." />
        <meta name="keywords" content="trading tools, stock market analysis, best brokers, trading software, borsa araçları, yatırım yazılımları" />
      </Helmet>

      <div className="container mx-auto px-4 py-20">
        
        {/* Section 1: Page Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gold-text">Temel Alım Satım Araçları</span>
          </h1>
          <p className="text-lg text-gray-400 mb-6 max-w-2xl mx-auto">
            Her yatırımcının ustalaşması gereken platformlar.
          </p>
          <blockquote className="text-md italic text-gray-500 border-l-2 border-yellow-600 pl-4 max-w-xl mx-auto">
            "Alım satımda başarı; disiplin, veri ve doğru araçlar üzerine kuruludur."
          </blockquote>
        </motion.section>

        {/* Section 2: Featured Tools */}
        <section className="space-y-12">
          {tools.map((tool, index) => (
            <motion.div 
              key={tool.name} 
              initial={{ opacity: 0, x: -50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="premium-card grid grid-cols-1 md:grid-cols-12 items-center gap-6 p-6 overflow-hidden hover:shadow-yellow-500/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="md:col-span-3 lg:col-span-2 flex justify-center items-center">
                <div className="w-40 h-24 bg-gray-900 rounded-lg flex items-center justify-center">
                  <img className="h-16 object-contain" alt={`${tool.name} logo`} src={tool.image} />
                </div>
              </div>
              <div className="md:col-span-6 lg:col-span-7 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start mb-2 space-x-2">
                  {tool.icon}
                  <h3 className="text-2xl font-bold text-yellow-500">{tool.name}</h3>
                </div>
                <p className="text-gray-400">{tool.description}</p>
              </div>
              <div className="md:col-span-3 lg:col-span-3 flex justify-center">
                <a href={tool.link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-yellow-600 text-yellow-500 hover:bg-yellow-600 hover:text-black transition-colors w-full md:w-auto">
                    {tool.buttonText}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Section 3: Integration Suggestion */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20"
        >
          <div className="premium-card p-8">
            <div className="flex items-start space-x-4">
              <BrainCircuit className="w-10 h-10 text-yellow-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold mb-3 gold-text">Önerilen Kurulum</h3>
                <p className="text-gray-400 mb-4">
                  Bu platformların hepsi, işlemleri verimli bir şekilde analiz etmek, yürütmek ve yönetmek isteyen yatırımcılar için vazgeçilmez yardımcılardır.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><span className="font-semibold text-yellow-500">Finviz:</span> Piyasa taraması ve fırsat tespiti için.</li>
                  <li><span className="font-semibold text-yellow-500">TradingView:</span> Detaylı grafik analizi ve strateji geliştirme için.</li>
                  <li><span className="font-semibold text-yellow-500">ICMarkets/OANDA:</span> Düşük maliyetli işlem gerçekleştirmek için.</li>
                  <li><span className="font-semibold text-yellow-500">TradeZero:</span> Kısa vadeli ve aktif alım satım işlemleri için.</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>
        
        {/* Footer CTA */}
        <section className="text-center mt-20">
          <Link to="/kurslar">
            <Button className="gold-gradient text-black font-bold text-lg px-8 py-6 hover:opacity-90 transition-opacity">
              Nova Trader Akademiye Katıl
            </Button>
          </Link>
        </section>

      </div>
    </>
  );
};

export default TradingToolsPage;