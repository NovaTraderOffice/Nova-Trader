import React from 'react';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: "Murat Y.",
    role: "VIP Üye",
    text: "VIP sinyaller sayesinde portföyümü 3 ayda ikiye katladım. Analizler nokta atışı!",
    stars: 5
  },
  {
    name: "Selin K.",
    role: "Borsa Eğitimi Öğrencisi",
    text: "Sıfırdan başladım, şimdi kendi analizlerimi yapabiliyorum. Ahmet hoca harika anlatıyor.",
    stars: 5
  },
  {
    name: "Caner D.",
    role: "Trader",
    text: "Türkiye'deki en kapsamlı eğitim platformu. Destek ekibi çok hızlı dönüyor.",
    stars: 5
  },
  {
    name: "Elif B.",
    role: "Kripto Yatırımcısı",
    text: "Risk yönetimi dersi hayatımı kurtardı. Artık panik satışı yapmıyorum.",
    stars: 4
  },
  {
    name: "Burak T.",
    role: "VIP Üye",
    text: "Sadece topluluk kanalı bile parasına değer. Herkes birbirine yardım ediyor.",
    stars: 5
  },
];

const ReviewCard = ({ review }) => (
  <div className="w-[350px] flex-shrink-0 bg-[#1a1a1a] border border-gray-800 p-6 rounded-xl mx-4 hover:border-yellow-500/50 transition-colors relative group">
    <Quote className="absolute top-4 right-4 text-gray-700 w-8 h-8 group-hover:text-yellow-500/20 transition-colors" />
    
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < review.stars ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} 
        />
      ))}
    </div>
    
    <p className="text-gray-300 text-sm mb-6 leading-relaxed">"{review.text}"</p>
    
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-black font-bold font-mono">
        {review.name.charAt(0)}
      </div>
      <div>
        <p className="font-bold text-white text-sm">{review.name}</p>
        <p className="text-xs text-yellow-500">{review.role}</p>
      </div>
    </div>
  </div>
);

const TestimonialMarquee = () => {
  return (
    <div className="py-20 bg-black overflow-hidden border-t border-gray-900">
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Öğrencilerimiz <span className="gold-text">Ne Diyor?</span></h2>
        <p className="text-gray-400">Başarı hikayelerine göz atın.</p>
      </div>

      <div className="flex w-max animate-marquee">
        {/* Randam lista de 2 ori pentru efect infinit */}
        {[...reviews, ...reviews, ...reviews].map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </div>
  );
};

export default TestimonialMarquee;