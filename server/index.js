require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User'); 
const authRoutes = require('./routes/authRoutes');
const Course = require('./models/Course');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    console.log("🚀 Webhook recepționat:", event.type);
  } catch (err) {
    console.error('❌ Eroare Semnătură Webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type.startsWith('customer.subscription.')) {
    const subscription = event.data.object;
    const stripeCustomerId = subscription.customer;
    const status = subscription.status;

    // Extragem datele de anulare
    const isCanceledAtPeriodEnd = subscription.cancel_at_period_end === true;
    const hasCancelAt = subscription.cancel_at !== null;

    console.log(`🔍 Analizăm subscriptia pt ${stripeCustomerId}. Status Stripe: ${status} | Cancelat din portal: ${isCanceledAtPeriodEnd || hasCancelAt}`);

    // Statusuri care înseamnă clar că a expirat / nu e plătit
    const inactiveStatuses = ['canceled', 'unpaid', 'past_due', 'incomplete_expired'];
    
    let newStatus = 'active';
    let endDate = null;

    // Stabilim noul status intern și data expirării (dacă există)
    if (inactiveStatuses.includes(status)) {
      newStatus = 'inactive';
    } else if (isCanceledAtPeriodEnd || hasCancelAt) {
      newStatus = 'pending_cancel';
      // Convertim secundele de la Stripe în milisecunde pentru Date()
      endDate = new Date((subscription.cancel_at || subscription.current_period_end) * 1000); 
    }

    try {
      const user = await User.findOne({ stripeCustomerId });

      if (user) {
        user.subscriptionStatus = newStatus;
        user.subscriptionEndDate = endDate; // Salvăm data în DB
        await user.save();
        
        console.log(`✅ Status actualizat în DB pentru ${user.email}: ${user.subscriptionStatus}`);
        
        // Dăm afară de pe grup DOAR dacă a expirat de tot ('inactive')
        if (newStatus === 'inactive' && user.telegramChatId) {
            console.log(`🚨 Pregătim kick de pe Telegram pentru ${user.email}...`);
            // bot.banChatMember(process.env.TELEGRAM_GROUP_ID, user.telegramChatId);
        }

      } else {
        console.log(`⚠️ Eroare logică: Stripe a trimis un eveniment pentru ID-ul ${stripeCustomerId}, dar nu există în DB.`);
      }
    } catch (err) {
      console.error("❌ Eroare la actualizarea DB:", err);
    }
  }

  res.json({ received: true });
});

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectat la MongoDB Atlas'))
  .catch((err) => console.error('❌ Eroare Mongo:', err));

app.use('/api', authRoutes);

if (process.env.TELEGRAM_BOT_TOKEN && process.env.ENABLE_BOT === 'true') {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
  console.log('🤖 Botul Telegram a pornit...');

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const type = msg.chat.type; // 'private', 'group', sau 'supergroup'
    
    // 1. AFLAREA ID-ului DE GRUP
    // Dacă mesajul e de pe un grup, doar afișăm ID-ul în consolă și ne oprim.
    if (type === 'group' || type === 'supergroup') {
        console.log(`📢 MESAJE GRUP (ID): ${chatId} | Trimis de: ${msg.from.first_name}`);
        return; // <--- ASTA OPREȘTE BOTUL SĂ RĂSPUNDĂ PE GRUP
    }

    // De aici în jos, codul rulează DOAR în privat (Private Chat)
    
    // 2. LOGICA DE VERIFICARE NUMĂR TELEFON
    if (msg.contact) {
      console.log(`📞 Primit contact de la ${msg.from.first_name}: ${msg.contact.phone_number}`);
      if (msg.contact.user_id !== msg.from.id) {
        bot.sendMessage(chatId, "❌ Lütfen kendi numaranızı gönderin."); 
        return;
      }

      try {
        const user = await User.findOne({ telegramChatId: chatId.toString() });

        if (user) {
          console.log(`✅ User găsit pentru contact: ${user.email}`);
          
          let realPhoneNumber = msg.contact.phone_number;
          if (!realPhoneNumber.startsWith('+')) {
            realPhoneNumber = `+${realPhoneNumber}`;
          }

          user.telegramPhone = realPhoneNumber;
          user.isVerified = true;
          user.verificationCode = undefined;
          
          await user.save();
          console.log(`💾 User salvat și verificat!`);

          const opts = {
            reply_markup: {
              remove_keyboard: true
            }
          };

          bot.sendMessage(chatId, `🎉 Tebrikler, ${user.fullName}! Hesabınız doğrulandı.`, opts);
        } else {
          console.log(`❌ Nu am găsit user cu chatId ${chatId} (poate nu a trimis codul înainte)`);
          bot.sendMessage(chatId, "❌ Hata: Önce kodu göndermelisiniz.");
        }
      } catch (error) {
        console.error("Eroare la procesare contact:", error);
      }
      return; 
    }

    // 3. LOGICA DE VERIFICARE COD (TEXT)
    if (msg.text) {
      const text = msg.text.trim();
      console.log(`📩 Primit text în privat: ${text}`);

      if (text === '/start') {
        bot.sendMessage(chatId, "Merhaba! Lütfen siteden aldığınız doğrulama kodunu gönderin.");
        return;
      }

      try {
        // Căutăm userul care are acest cod generat în site
        const user = await User.findOne({ verificationCode: text });

        if (user) {
          console.log(`🔍 Cod valid găsit pentru: ${user.email}`);

          if (user.isVerified) {
             bot.sendMessage(chatId, "✅ Hesabınız zaten doğrulandı!");
          } else {
             // Salvăm ChatID-ul temporar ca să știm cui îi cerem telefonul
             user.telegramChatId = chatId.toString();
             await user.save();
             console.log(`🔗 ChatID ${chatId} legat de userul ${user.email}`);

             const opts = {
               reply_markup: {
                 keyboard: [
                   [{
                     text: "📱 Telefon Numarasını Doğrula",
                     request_contact: true
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: title,
            },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      
      success_url: `https://novatrader.org/basarili?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`,
      cancel_url: `https://novatrader.org/profil`,
      
      metadata: {
        userId: userId,
        courseId: courseId
      }
    });
    
    res.json({ url: session.url });

  } catch (error) {
    console.error("Eroare la Stripe:", error);
    res.status(500).json({ error: 'Nu s-a putut genera plata' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const { sessionId, courseId, userId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const User = require('./models/User');
      
      const actualUserId = userId || session.client_reference_id;
      const user = await User.findById(actualUserId);

      if (user) {
        if (session.mode === 'subscription') {
          user.subscriptionStatus = 'active';
          user.stripeCustomerId = session.customer; 
          await user.save();
          return res.json({ success: true, message: "Abonament activat cu succes!" });
        } 
        
        else {
          if (courseId && !user.purchasedCourses.includes(courseId)) {
            user.purchasedCourses.push(courseId);
            await user.save();
          }
          return res.json({ success: true, message: "Curs activat cu succes!" });
        }
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
    
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User negăsit" });
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
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/subscriptions/create-checkout-session', async (req, res) => {
  try {
    const { userId } = req.body; 

    if (!userId) {
      return res.status(400).json({ error: "User ID lipsă." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1Szdbg3YvNCbZO3PvG7r4OpB', 
          quantity: 1,
        },
      ],
success_url: `https://novatrader.org/basarili?session_id={CHECKOUT_SESSION_ID}`,
cancel_url: `https://novatrader.org/abonelikler`,
      
      client_reference_id: userId, 
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error("Eroare la crearea sesiunii Stripe:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/subscriptions/create-portal-session', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);

    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({ error: "Nu ai niciun abonament activ momentan." });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `https://novatrader.org/profil`,
    });

    res.json({ url: portalSession.url });

  } catch (error) {
    console.error("Eroare la crearea Portalului Stripe:", error);
    res.status(500).json({ error: "Eroare la accesarea portalului." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pe portul ${PORT}`));