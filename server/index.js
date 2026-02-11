require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User'); // Avem nevoie de User pt Bot
const authRoutes = require('./routes/authRoutes'); // Importăm rutele noi
const Course = require('./models/Course');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());
app.use(cors());

// --- CONECTARE MONGO ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectat la MongoDB Atlas'))
  .catch((err) => console.error('❌ Eroare Mongo:', err));

// --- RUTE API ---
// Toate rutele din authRoutes vor începe automat cu /api
app.use('/api', authRoutes);

// --- TELEGRAM BOT (Rămâne aici pentru că trebuie să ruleze continuu) ---
if (process.env.TELEGRAM_BOT_TOKEN) {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
  console.log('🤖 Botul Telegram a pornit...');

  // Ascultăm ORICE mesaj
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    
    // --- CAZUL 1: Utilizatorul a trimis CONTACTUL (a apăsat butonul) ---
    if (msg.contact) {
      console.log(`📞 Primit contact de la ${msg.from.first_name}: ${msg.contact.phone_number}`);

      // Verificăm dacă numărul trimis aparține contului care a dat click
      if (msg.contact.user_id !== msg.from.id) {
        bot.sendMessage(chatId, "❌ Lütfen kendi numaranızı gönderin."); // Te rog trimite numărul tău
        return;
      }

      try {
        // Căutăm userul care are acest ChatID (l-am salvat când a băgat codul)
        // Atenție: Căutăm un user care are DEJA acest chatId salvat
        const user = await User.findOne({ telegramChatId: chatId.toString() });

        if (user) {
          console.log(`✅ User găsit pentru contact: ${user.email}`);
          
          // Formată numărul (Telegram îl dă uneori fără +)
          let realPhoneNumber = msg.contact.phone_number;
          if (!realPhoneNumber.startsWith('+')) {
            realPhoneNumber = `+${realPhoneNumber}`;
          }

          // Actualizăm datele
          user.telegramPhone = realPhoneNumber;
          user.isVerified = true;
          user.verificationCode = undefined; // Ștergem codul, nu mai e nevoie
          
          await user.save();
          console.log(`💾 User salvat și verificat!`);

          // Scoatem tastatura de pe ecran
          const opts = {
            reply_markup: {
              remove_keyboard: true
            }
          };

          bot.sendMessage(chatId, `🎉 Tebrikler, ${user.fullName}! Hesabınız doğrulandı.`, opts);
        } else {
          console.log(`❌ Nu am găsit user cu chatId ${chatId}`);
          bot.sendMessage(chatId, "❌ Hata: Önce kodu göndermelisiniz."); // Eroare: Întâi trimite codul
        }
      } catch (error) {
        console.error("Eroare la procesare contact:", error);
      }
      return; // Ieșim, nu mai verificăm textul
    }

    // --- CAZUL 2: Utilizatorul a trimis TEXT (Codul sau comanda /start) ---
    if (msg.text) {
      const text = msg.text.trim();
      console.log(`📩 Primit text: ${text}`);

      if (text === '/start') {
        bot.sendMessage(chatId, "Merhaba! Lütfen siteden aldığınız doğrulama kodunu gönderin.");
        return;
      }

      try {
        // Căutăm userul după CODUL introdus
        const user = await User.findOne({ verificationCode: text });

        if (user) {
          console.log(`🔍 Cod valid găsit pentru: ${user.email}`);

          if (user.isVerified) {
             bot.sendMessage(chatId, "✅ Hesabınız zaten doğrulandı!");
          } else {
             // 1. Salvăm ChatID-ul ACUM. Asta e legătura dintre cod și viitorul contact.
             user.telegramChatId = chatId.toString();
             await user.save();
             console.log(`🔗 ChatID ${chatId} legat de userul ${user.email}`);

             // 2. Cerem Contactul cu buton special
             const opts = {
               reply_markup: {
                 keyboard: [
                   [{
                     text: "📱 Telefon Numarasını Doğrula",
                     request_contact: true // SOLICITĂ CONTACTUL
                   }]
                 ],
                 resize_keyboard: true,
                 one_time_keyboard: true
               }
             };

             bot.sendMessage(chatId, "Kod doğru! ✅\nLütfen aşağıdaki butona tıklayarak telefon numaranızı doğrulayın.", opts);
          }
        } else {
          console.log(`❌ Cod invalid: ${text}`);
          bot.sendMessage(chatId, "❌ Geçersiz kod.");
        }
      } catch (error) {
        console.error("Eroare la procesare text:", error);
        bot.sendMessage(chatId, "Sunucu hatası.");
      }
    }
  });
}

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { courseId, title, price, userId } = req.body;

    // Creăm sesiunea de plată pe Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur', // Moneda ta (euro)
            product_data: {
              name: title, // Numele cursului
            },
            unit_amount: price * 100, // Stripe calculează în cenți (119€ = 11900 cenți)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Unde îl trimite după ce plătește cu succes
      success_url: `${process.env.CLIENT_URL}/basarili?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`,
      // Unde îl trimite dacă dă "Cancel" (Înapoi la cursuri)
      cancel_url: `${process.env.CLIENT_URL}/kurslar`,
      
      // Aici ascundem ID-urile ca să știm CE și CINE a cumpărat după ce se termină plata
      metadata: {
        userId: userId,
        courseId: courseId
      }
    });

    // Răspundem cu link-ul generat de Stripe
    res.json({ url: session.url });

  } catch (error) {
    console.error("Eroare la Stripe:", error);
    res.status(500).json({ error: 'Nu s-a putut genera plata' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { sessionId, courseId, userId } = req.body;

    // 1. Întrebăm Stripe dacă sesiunea asta chiar a fost plătită
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // 2. Găsim utilizatorul în baza de date
      const User = require('./models/User'); // Ne asigurăm că avem modelul
      const user = await User.findById(userId);

      if (user) {
        // 3. Dacă nu are deja cursul, i-l adăugăm în "buzunar"
        if (!user.purchasedCourses.includes(courseId)) {
          user.purchasedCourses.push(courseId);
          await user.save();
        }
        return res.json({ success: true, message: "Curs activat!" });
      }
    }

    res.status(400).json({ success: false, message: "Plata nu a fost confirmată." });
  } catch (error) {
    console.error("Eroare la verificarea plății:", error);
    res.status(500).json({ success: false, error: 'Eroare server' });
  }
});

app.get('/api/my-courses/:userId', async (req, res) => {
  try {
    const User = require('./models/User');
    const Course = require('./models/Course');
    
    // Găsim userul
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User negăsit" });

    // Căutăm în baza de date DOAR cursurile care au ID-ul în buzunarul userului
    const purchasedCourses = await Course.find({ 
      _id: { $in: user.purchasedCourses } 
    });

    res.json(purchasedCourses);
  } catch (error) {
    console.error("Eroare la preluarea cursurilor:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Kurs bulunamadı" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const Course = require('./models/Course');
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const Course = require('./models/Course');
    // { new: true } returnează cursul actualizat
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const Course = require('./models/Course');
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cursul a fost șters cu succes!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    // Luăm toți utilizatorii, dar fără parole!
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ADMIN: SCHIMBĂ ROLUL UNUI UTILIZATOR (User <-> Admin) ---
app.put('/api/admin/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pe portul ${PORT}`));