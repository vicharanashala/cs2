const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// Middleware to check authentication
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

// Middleware to check admin
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Forbidden - Admins only' });
};

// GET all FAQs (public)
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add new FAQ (authenticated)
router.post('/add', isAuth, async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await FAQ.create({
      question,
      answer,
      createdBy: req.user.name
    });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add reply to FAQ (authenticated)
router.post('/:id/reply', isAuth, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    faq.replies.push({
      text: req.body.text,
      createdBy: req.user.name
    });
    await faq.save();
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE faq (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT edit faq (admin only)
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question, answer },
      { new: true }
    );
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;