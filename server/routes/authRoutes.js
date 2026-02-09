const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Definim rutele și le legăm de controller
router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/profile', authController.updateProfile);

module.exports = router;