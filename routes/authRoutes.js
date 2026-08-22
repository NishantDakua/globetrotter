const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

// Local Registration & Login
router.post('/api/auth/register', authController.register);
router.post('/api/auth/login', authController.login);

// Current User & Logout
router.get('/api/auth/me', authController.me);
router.post('/api/auth/logout', authController.logout);

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `\${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  (req, res) => {
    // Successful authentication, redirect to dashboard.
    res.redirect(`\${process.env.CLIENT_URL}/dashboard`);
  }
);

module.exports = router;
