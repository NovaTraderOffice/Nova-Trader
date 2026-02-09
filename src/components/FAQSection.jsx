import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Eğitimler canlı mı yoksa kayıtlı mı?",
    answer: "Eğitimlerimiz önceden kaydedilmiş yüksek kaliteli videolardan oluşur. Böylece kendi hızınızda, dilediğiniz zaman ve dilediğiniz yerde izleyebilirsiniz. Ayrıca VIP üyeler için haftalık canlı soru-cevap yayınları yapıyoruz."
  },
  {
    question: "Satın aldıktan sonra erişim süresi ne kadar?",
    answer: "Ömür boyu! Bir kez satın aldığınızda, kurs içeriğine ve gelecekte gelecek güncellemelere sınırsız erişim hakkınız olur."
  },
  {
    question: "İade politikanız nedir?",
    answer: "Dijital ürünlerin doğası gereği, içerik görüntülendikten sonra iade yapamıyoruz. Ancak teknik bir sorun yaşarsanız destek ekibimiz 7/24 yardımcı olmaya hazırdır."
  },
  {
    question: "Mobilden izleyebilir miyim?",
    answer: "Evet, platformumuz %100 mobil uyumludur. Telefondan, tabletten veya bilgisayardan sorunsuz bir şekilde dersleri takip edebilirsiniz."
  }
];

const FAQItem = ({ i, expanded, setExpanded, q, a }) => {
  const isOpen = i === expanded;

  return (
    <motion.div 
      initial={false}
      className="border border-gray-800 rounded-xl bg-[#1a1a1a] overflow-hidden"
    >
      <motion.header
        initial={false}
        onClick={() => setExpanded(isOpen ? false : i)}
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/5 transition-colors"
      >
        <span className="text-lg font-semibold text-white">{q}</span>
        <div className="text-yellow-500">
          {isOpen ? <Minus /> : <Plus />}
        </div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-gray-400 leading-relaxed">
              {a}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <HelpCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sıkça Sorulan <span className="gold-text">Sorular</span></h2>
          <p className="text-gray-400">Aklınıza takılan soruların cevaplarını burada bulabilirsiniz.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              i={i}
              expanded={expanded}
              setExpanded={setExpanded}
              q={faq.question}
              a={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;