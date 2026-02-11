const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telegramPhone: { type: String }, 
  password: { type: String, required: true },
  purchasedCourses: [{ type: String }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // Verificare & Telegram
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  telegramChatId: { type: String },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);