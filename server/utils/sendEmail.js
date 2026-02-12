const { Resend } = require('resend');

// Inițializăm Resend cu cheia din .env
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  console.log(`🚀 [Resend] Pregătesc trimiterea către: ${options.email}`);

  try {
    const data = await resend.emails.send({
      // IMPORTANT: Până validezi domeniul novatrader.org în Resend, 
      // trebuie să folosești 'onboarding@resend.dev' la 'from'.
      // După validare, poți pune: 'Suport NovaTrader <suport@novatrader.org>'
      from: 'Nova Trader <onboarding@resend.dev>', 
      
      to: options.email,
      subject: options.subject,
      text: options.message,
    });

    if (data.error) {
        console.error("❌ [Resend] Eroare API:", data.error);
        throw new Error(data.error.message);
    }

    console.log(`✅ [Resend] Email trimis cu succes! ID: ${data.data.id}`);
    return data;

  } catch (error) {
    console.error("❌ [Resend] CRASH:", error.message);
    throw error;
  }
};

module.exports = sendEmail;