require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User'); 
const authRoutes = require('./routes/authRoutes');
const cron = require('node-cron');
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
            console.log(`🚨 Abonament expirat pentru ${user.email}. Îl scoatem din grup...`);
            
            if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_GROUP_ID) {
                try {
                    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
                  
                    await bot.banChatMember(process.env.TELEGRAM_GROUP_ID, user.telegramChatId);
                    
                    await bot.unbanChatMember(process.env.TELEGRAM_GROUP_ID, user.telegramChatId);
                    
                    await bot.sendMessage(user.telegramChatId, "VIP aboneliğinizin süresi doldu. Din grubunu kaldırdık. Sizi her zaman tekrar aramızda görmeyi dört gözle bekliyoruz!");
                    
                    console.log(`KICKED: ${user.email} a fost eliminat din Telegram.`);
                } catch (kickErr) {
                    console.error("Nu am putut da kick :", kickErr.message);
                }
            }
        }
      } else {
        console.log(`Eroare logică: Stripe a trimis un eveniment pentru ID-ul ${stripeCustomerId}, dar nu există în DB.`);
      }
    } catch (err) {
      console.error("Eroare la actualizarea DB:", err);
    }
  }

  res.json({ received: true });
});

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectat la MongoDB Atlas'))
  .catch((err) => console.error('Eroare Mongo:', err));

app.use('/api', authRoutes);

if (process.env.TELEGRAM_BOT_TOKEN && process.env.ENABLE_BOT === 'true') {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
  console.log('Botul Telegram a pornit');

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const type = msg.chat.type;
    if (type === 'group' || type === 'supergroup') {
        return;
    }

    // 2. LOGICA DE VERIFICARE NUMĂR TELEFON
    if (msg.contact) {
      console.log(`Primit contact de la ${msg.from.first_name}: ${msg.contact.phone_number}`);
      if (msg.contact.user_id !== msg.from.id) {
        bot.sendMessage(chatId, "Lütfen kendi numaranızı gönderin."); 
        return;
      }

      try {
        const user = await User.findOne({ telegramChatId: chatId.toString() });

        if (user) {
          console.log(`User găsit pentru contact: ${user.email}`);
          
          let realPhoneNumber = msg.contact.phone_number;
          if (!realPhoneNumber.startsWith('+')) {
            realPhoneNumber = `+${realPhoneNumber}`;
          }

          user.telegramPhone = realPhoneNumber;
          user.isVerified = true;
          user.verificationCode = undefined;
          
          await user.save();
          console.log(`User salvat și verificat!`);

          const opts = {
            reply_markup: {
              remove_keyboard: true
            }
          };

          bot.sendMessage(chatId, `🎉 Tebrikler, ${user.fullName}! Hesabınız doğrulandı.`, opts);
        } else {
          console.log(`Nu am găsit user cu chatId ${chatId} (poate nu a trimis codul înainte)`);
          bot.sendMessage(chatId, "Hata: Önce kodu göndermelisiniz.");
        }
      } catch (error) {
        console.error("Eroare la procesare contact:", error);
      }
      return; 
    }

    // 3. LOGICA DE VERIFICARE COD (TEXT)
    if (msg.text) {
      const text = msg.text.trim();
      console.log(`Primit text în privat: ${text}`);

      if (text === '/start') {
        bot.sendMessage(chatId, "Merhaba! Lütfen siteden aldığınız doğrulama kodunu gönderin.");
        return;
      }

      try {
        // Căutăm userul care are acest cod generat în site
        const user = await User.findOne({ verificationCode: text });

        if (user) {
          console.log(`Cod valid găsit pentru: ${user.email}`);

          if (user.isVerified) {
             bot.sendMessage(chatId, "Hesabınız zaten doğrulandı!");
          } else {
             // Salvăm ChatID-ul temporar ca să știm cui îi cerem telefonul
             user.telegramChatId = chatId.toString();
             await user.save();
             console.log(`🔗 ChatID ${chatId} legat de userul ${user.email}`);

             const opts = {
               reply_markup: {
                 keyboard: [
                   [{
                     text: "Telefon Numarasını Doğrula",
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
          console.log(`Cod invalid: ${text}`);
          bot.sendMessage(chatId, "Geçersiz kod.");
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

// --- RUTA MODIFICATĂ CU PROTECȚIE LA DATE ---
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { sessionId, userId, courseId } = req.body;
    console.log("🔍 Verificare plată pentru sesiunea:", sessionId);

    if (!sessionId) {
      return res.status(400).json({ success: false, error: "Lipseste Session ID" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Căutăm userul
      const User = require('./models/User'); 
      const user = await User.findById(userId || session.client_reference_id);

      if (!user) {
        console.error("❌ Userul nu a fost găsit în DB");
        return res.status(404).json({ success: false, error: "Utilizator negăsit" });
      }

      // LOGICA ABONAMENT (cu protecție la dată)
      if (session.mode === 'subscription') {
        if (session.subscription) {
            try {
                const subscription = await stripe.subscriptions.retrieve(session.subscription);
                user.subscriptionStatus = 'active';
                user.stripeCustomerId = session.customer;

                // Calculăm data cu protecție (Fallback)
                let expiryDate;
                if (subscription && subscription.current_period_end) {
                    expiryDate = new Date(subscription.current_period_end * 1000);
                }

                // Dacă data e invalidă (Invalid Date) sau null, punem manual 30 de zile
                if (!expiryDate || isNaN(expiryDate.getTime())) {
                    console.log("⚠️ Data Stripe invalidă, folosim fallback 30 zile.");
                    const now = new Date();
                    now.setDate(now.getDate() + 30);
                    expiryDate = now;
                }

                user.subscriptionEndDate = expiryDate;
                console.log(`✅ Abonament setat până la: ${expiryDate}`);

                // Trimitem link Telegram dacă avem datele
                if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_GROUP_ID && user.telegramChatId) {
                    try {
                        const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
                        const inviteLink = await bot.createChatInviteLink(process.env.TELEGRAM_GROUP_ID, { member_limit: 1 });
                        await bot.sendMessage(user.telegramChatId, `🎉 VIP link: ${inviteLink.invite_link}`);
                    } catch (tgErr) {
                        console.error("⚠️ Eroare trimitere link TG:", tgErr.message);
                    }
                }

            } catch (subErr) {
                console.error("❌ Eroare la procesare abonament Stripe:", subErr.message);
                // Fallback critic: Activăm oricum accesul dacă plata e 'paid'
                user.subscriptionStatus = 'active';
                user.stripeCustomerId = session.customer;
                const fallbackDate = new Date();
                fallbackDate.setDate(fallbackDate.getDate() + 30);
                user.subscriptionEndDate = fallbackDate;
            }
        }
      } 
      // LOGICA CURS
      else if (courseId) {
        if (!user.purchasedCourses.includes(courseId)) {
          user.purchasedCourses.push(courseId);
        }
      }

      await user.save();
      // Trimitem userul actualizat înapoi
      return res.json({ success: true, updatedUser: user });
    }

    res.status(400).json({ success: false, message: "Plata neconfirmată" });
  } catch (error) {
    console.error("❌ EROARE SERVER DETALIATĂ:", error.message); 
    res.status(500).json({ success: false, error: error.message });
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
    console.log("Portal Session solicitat pentru UserID:", userId); // Debug 1

    if (!userId) {
        return res.status(400).json({ error: "Frontend-ul nu a trimis userId!" });
    }
    
    const user = await User.findById(userId);

    if (!user) {
        console.log("❌ User negăsit în DB");
        return res.status(400).json({ error: "Userul nu există în baza de date." });
    }

    console.log(`🔍 User găsit: ${user.email} | StripeCustomer: ${user.stripeCustomerId}`); // Debug 2

    if (!user.stripeCustomerId) {
      return res.status(400).json({ error: "Userul are status activ, dar lipsește stripeCustomerId din DB." });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `https://novatrader.org/profil`,
    });

    res.json({ url: portalSession.url });

  } catch (error) {
    console.error("Eroare la crearea Portalului Stripe:", error);
    res.status(500).json({ error: "Eroare la accesarea portalului: " + error.message });
  }
});

cron.schedule('0 10 * * *', async () => {
  console.log('⏰ Verificăm abonamentele care expiră în curând...');
  
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);
  
  // Setăm intervalul pentru ziua respectivă (între 00:00 și 23:59)
  const startOfDay = new Date(threeDaysLater.setHours(0, 0, 0, 0));
  const endOfDay = new Date(threeDaysLater.setHours(23, 59, 59, 999));

  try {
    // Căutăm useri care expiră exact peste 3 zile
    const usersExpiring = await User.find({
      subscriptionEndDate: { $gte: startOfDay, $lte: endOfDay },
      subscriptionStatus: { $in: ['active', 'pending_cancel'] },
      telegramChatId: { $ne: null } // Doar cei care au botul conectat
    });

    if (usersExpiring.length > 0) {
      const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
      
      for (const user of usersExpiring) {
        try {
          await bot.sendMessage(
            user.telegramChatId, 
            `⚠️ <b>Atenție, ${user.fullName}!</b>\n\nAbonamentul tău VIP expiră în 3 zile (${user.subscriptionEndDate.toLocaleDateString()}).\n\nAsigură-te că ai fonduri pe card pentru a nu pierde accesul la grup.`,
            { parse_mode: 'HTML' }
          );
          console.log(`📩 Notificare trimisă către ${user.email}`);
        } catch (err) {
          console.error(`Eroare trimitere mesaj la ${user.email}:`, err.message);
        }
      }
    } else {
      console.log('✅ Niciun abonament nu expiră peste 3 zile.');
    }
  } catch (error) {
    console.error('❌ Eroare la Cron Job:', error);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pe portul ${PORT}`));