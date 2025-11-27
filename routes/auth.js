const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models');

router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, grade } = req.body;
    if (!name || !email || !password) {
      req.flash('error', 'Please fill all required fields.');
      return res.redirect('/signup');
    }
    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/signup');
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/signup');
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash: hash, grade, role: 'student' });
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    req.flash('success', 'Signed up and logged in.');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/signup');
  }
});

router.get('/login', (req, res) => res.render('login'));

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      req.flash('error', 'Invalid credentials.');
      return res.redirect('/login');
    }
    const ok = await user.verifyPassword(password);
    if (!ok) {
      req.flash('error', 'Invalid credentials.');
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    req.flash('success', 'Logged in successfully.');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/login');
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
