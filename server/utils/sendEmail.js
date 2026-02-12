const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Configurare pentru Railway / Cloud Hosting
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,                 // FOLOSIM 587 (Standard pentru Cloud)
    secure: false,             // Trebuie FALSE pentru 587 (folosește STARTTLS automat)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false
    },
    family: 4 
  });

  const message = {
    from: `"Nova Trader Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  console.log(`📨 [SMTP] Încerc conectarea la Gmail pe portul 587...`);

  try {
    // Verificăm conexiunea înainte de trimitere
    await transporter.verify();
    console.log("✅ [SMTP] Conexiune reușită!");
    
    const info = await transporter.sendMail(message);
    console.log(`✅ [SMTP] Email trimis! ID: ${info.messageId}`);
  } catch (error) {
    console.error("❌ [SMTP] EROARE GRAVĂ:", error);
    throw error;
  }
};

module.exports = sendEmail;