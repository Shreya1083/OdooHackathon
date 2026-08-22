const express = require('express');
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateSignup, validateLogin } = require('../middleware/validate');

const router = express.Router();

// Support both /signup and /register endpoints
router.post('/signup', validateSignup, signup);
router.post('/register', validateSignup, signup);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);

module.exports = router;