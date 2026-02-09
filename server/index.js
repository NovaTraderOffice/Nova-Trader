require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const User = require('./models/User'); // Avem nevoie de User pt Bot
const authRoutes = require('./routes/authRoutes'); // Importăm rutele noi

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server pe portul ${PORT}`));