const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// ==================== LOCAL AUTH ====================

// POST Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and name'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered. Please login or use a different email.'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: 'student',
      googleId: null // No Google account linked
    });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// POST Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please check your email or sign up.'
      });
    }

    // Check if user has a password (Google-only accounts don't have password)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account uses Google login. Please use Google Sign-In instead.'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Wrong password. Please try again or reset your password.'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// ==================== GOOGLE OAUTH ====================

// Google login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: 'http://localhost:3000/login'
}), (req, res) => {
  // Generate JWT for Google user
  const token = jwt.sign(
    { id: req.user._id, email: req.user.email, name: req.user.name, role: req.user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
  res.redirect(`http://localhost:3000/dashboard?token=${token}`);
});

// ==================== PROTECTED ROUTES ====================

// GET current user (JWT auth)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET current user (session auth - for Google OAuth)
router.get('/current-user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.json(null);
  }
});

// POST Logout
router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ success: true, message: 'Logout successful!' });
  });
});

// GET logout (for Google OAuth redirect)
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:3000');
  });
});

module.exports = router;