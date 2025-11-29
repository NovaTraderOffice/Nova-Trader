// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Permite frontend-ului să vorbească cu backend-ul

// Conectare la MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectat la MongoDB Atlas'))
  .catch((err) => console.error('❌ Eroare conectare MongoDB:', err));

// Definire simplă a unui Model (Schema) pentru Utilizator
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }, // În producție parola se criptează!
});
const User = mongoose.model('User', UserSchema);

// RUTE
app.get('/', (req, res) => {
  res.send('API-ul NovaTrader funcționează!');
});

// Ruta de Înregistrare (Test)
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'Utilizator creat cu succes!' });
  } catch (error) {
    res.status(500).json({ error: 'Eroare la crearea utilizatorului' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});