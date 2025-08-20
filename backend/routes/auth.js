const express = require('express');
const { authLimiter } = require('../middlewares/rateLimiter');
const { validate } = require('../middlewares/validation');
const { protect } = require('../middlewares/auth');
const { registerSchema, loginSchema } = require('../validators');
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  googleAuth,
  googleCallback,
  githubAuth,
  githubCallback,
  getMe,
  logout
} = require('../controllers/authController');

const router = express.Router();

// Register a new user
router.post('/register', authLimiter, validate(registerSchema), register);

// Login user
router.post('/login', authLimiter, validate(loginSchema), login);

// --- PASSWORD RESET ROUTES ---
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);


// --- SOCIAL AUTH ROUTES ---
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);

// --- CURRENT USER ROUTES ---
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
