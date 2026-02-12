const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Configurare explicită (mai sigură decât service: 'gmail')
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Portul pentru SSL (Secure)
    secure: true, // TRUE pentru portul 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Asta ajută dacă serverul are probleme cu certificatele
      rejectUnauthorized: false
    }
  });

  // 2. Verificăm conexiunea înainte să trimitem (pentru debug)
  try {
    console.log("🔌 Încerc conectarea la SMTP...");
    await transporter.verify();
    console.log("✅ Conexiune SMTP reușită!");
  } catch (error) {
    console.error("❌ EROARE SMTP LA CONECTARE:", error);
    throw new Error("Nu m-am putut conecta la Gmail.");
  }

  // 3. Pregătim mesajul
  const message = {
    from: `Nova Trader Support <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 4. Trimitem
  console.log("📨 Trimit emailul...");
  const info = await transporter.sendMail(message);
  console.log("✅ Email trimis cu ID:", info.messageId);
};

module.exports = sendEmail;