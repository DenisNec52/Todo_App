const express = require('express');
const { ensureAuthenticated, ensureGuest } = require('../middleware/auth');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/todos');
  }

  return res.render('home', {
    title: 'ToDo App',
    user: req.session.user
  });
});

router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile', {
    title: 'Profilo',
    user: req.session.user
  });
});

module.exports = router;
