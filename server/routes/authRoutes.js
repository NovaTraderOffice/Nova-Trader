const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs'); 
const User = require('../models/User'); 
const sendEmail = require('../utils/sendEmail');
const authController = require('../controllers/authController');


router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/profile', authController.updateProfile);

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Nu există un cont cu acest email." });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `https://novatrader.org/reset-password/${resetToken}`;

    const message = `Parola sıfırlama talebinde bulundunuz. Yeni bir parola belirlemek için lütfen bu bağlantıya gidin:\n\n${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Resetare Parolă Nova Trader',
        message,
      });

      res.status(200).json({ success: true, message: "Email trimis!" });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ message: "Emailul nu a putut fi trimis." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/reset-password/:token', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: "Link invalid sau expirat." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Şifre başarıyla değiştirildi!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;