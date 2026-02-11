const User = require('../models/User');
const crypto = require('crypto');

// --- REGISTER ---
exports.register = async (req, res) => {
  try {
    const { fullName, email, telegramPhone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email deja folosit!" });

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = new User({ 
      fullName, email, telegramPhone, password, verificationCode 
    });
    
    await newUser.save();

    res.status(201).json({ 
      message: 'Cont creat!', 
      verificationCode,
      botUsername: 'NovaTrader_SupportBot' // Pune username-ul botului tau aici
    });
  } catch (error) {
    res.status(500).json({ message: 'Eroare server.' });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(404).json({ message: "Cont inexistent." });
    if (user.password !== password) return res.status(401).json({ message: "Parolă greșită." });
    if (!user.isVerified) return res.status(403).json({ message: "Cont neactivat! Verifică Telegram." });

    res.status(200).json({
      message: "Login reușit!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        telegramPhone: user.telegramPhone,
        role:user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Eroare la server." });
  }
};

// --- UPDATE PROFILE ---
exports.updateProfile = async (req, res) => {
  try {
    const { email, fullName, telegramPhone } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found." });

    user.fullName = fullName || user.fullName;
    user.telegramPhone = telegramPhone || user.telegramPhone;
    
    await user.save();

    res.status(200).json({
      message: "Profil actualizat!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        telegramPhone: user.telegramPhone
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Eroare server." });
  }
};