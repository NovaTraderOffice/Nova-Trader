require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🔌 Conectat la MongoDB pentru Seed'))
  .catch(err => console.log(err));

const coursesData = [
  {
    title: "Temel Borsa Eğitimi",
    description: "Borsaya sıfırdan başlayanlar için kapsamlı eğitim programı.",
    price: 119,
    isAvailable: true,
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
    isBundle: false,
    lessons: [
      { title: "Bölüm 1: Borsa Nedir?", videoUrl: "https://player.vimeo.com/video/1163897386", duration: "03:47" },
      { title: "Bölüm 2: Temel Kavramlar", videoUrl: "https://player.vimeo.com/video/1163897409", duration: "07:56" },
      { title: "Bölüm 3: Mum Grafikleri", videoUrl: "https://player.vimeo.com/video/1163897429", duration: "08:15" },
      { title: "Bölüm 4: Destek ve Direnç", videoUrl: "https://player.vimeo.com/video/1163897450", duration: "09:06" },
      { title: "Bölüm 5: Trend Çizgileri", videoUrl: "https://player.vimeo.com/video/1163897471", duration: "03:21" },
      { title: "Bölüm 6: Formasyonlar 1", videoUrl: "https://player.vimeo.com/video/1163897488", duration: "04:29" },
      { title: "Bölüm 7: Formasyonlar 2", videoUrl: "https://player.vimeo.com/video/1163897503", duration: "02:11" },
      { title: "Bölüm 8: İndikatörler 1", videoUrl: "https://player.vimeo.com/video/1163897520", duration: "06:16" },
      { title: "Bölüm 9: İndikatörler 2", videoUrl: "https://player.vimeo.com/video/1163897543", duration: "06:33" },
      { title: "Bölüm 10: Hacim Analizi", videoUrl: "https://player.vimeo.com/video/1163897565", duration: "05:00" },
      { title: "Bölüm 11: Risk Yönetimi", videoUrl: "https://player.vimeo.com/video/1163897598", duration: "08:40" },
      { title: "Bölüm 12: Psikoloji", videoUrl: "https://player.vimeo.com/video/1163897635", duration: "07:11" },
      { title: "Bölüm 13: Strateji Kurma 1", videoUrl: "https://player.vimeo.com/video/1163897664", duration: "02:40" },
      { title: "Bölüm 14: Strateji Kurma 2", videoUrl: "https://player.vimeo.com/video/1163897694", duration: "05:36" },
      { title: "Bölüm 15: Portföy Yönetimi", videoUrl: "https://player.vimeo.com/video/1163897733", duration: "04:35" },
      { title: "Bölüm 16: Canlı Piyasa Analizi 1", videoUrl: "https://player.vimeo.com/video/1163897766", duration: "06:27" },
      { title: "Bölüm 17: Canlı Piyasa Analizi 2", videoUrl: "https://player.vimeo.com/video/1163897787", duration: "07:57" },
      { title: "Bölüm 18: Sık Yapılan Hatalar", videoUrl: "https://player.vimeo.com/video/1163897807", duration: "06:31" },
      { title: "Bölüm 19: Kapanış ve Özet", videoUrl: "https://player.vimeo.com/video/1163897821", duration: "04:47" }
    ]
  },
  {
    title: "İleri Seviye Trading",
    description: "Profesyonel trading stratejileri ve teknik analiz eğitimi.",
    price: 249,
    isAvailable: false,
    thumbnail: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7",
    isBundle: false,
    lessons: []
  },
  {
    title: "Komple Eğitim Paketi",
    description: "Tüm kurslarımıza sınırsız erişim ve özel mentorluk.",
    price: 299,
    isAvailable: false,
    thumbnail: "https://images.unsplash.com/photo-1463583723781-ca0bb5b0905f",
    isBundle: true,
    lessons: []
  }
];

const seedDB = async () => {
  await Course.deleteMany({}); // Șterge tot ce e vechi
  await Course.insertMany(coursesData); // Inserează astea noi
  console.log("✅ Cursurile au fost adăugate cu succes în MongoDB!");
  process.exit();
};

seedDB();