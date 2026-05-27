const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:3000/login'
}), (req, res) => {
  res.redirect('http://localhost:3000/dashboard');
});

// Get current user
router.get('/current-user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.json(null);
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:3000');
  });
});

module.exports = router;