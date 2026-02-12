const { Resend } = require('resend');

// Inițializăm Resend cu cheia din .env
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {

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
        throw new Error(data.error.message);
    }
    return data;

  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;