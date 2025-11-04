const express = require('express');
const { ensureGuest } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/register', ensureGuest, authController.showRegister);
router.post('/register', ensureGuest, authController.register);
router.get('/login', ensureGuest, authController.showLogin);
router.post('/login', ensureGuest, authController.login);
router.post('/logout', authController.logout);

module.exports = router;
