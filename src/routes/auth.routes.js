const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller'); //discordLoginOrRegister
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
//router.post('/discord-auth', discordLoginOrRegister);
router.get('/me', auth, getMe);

module.exports = router;