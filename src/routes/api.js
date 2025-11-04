const express = require('express');
const { ensureApiAuthenticated } = require('../middleware/apiAuth');
const authController = require('../controllers/api/authApiController');
const todoController = require('../controllers/api/todoApiController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', ensureApiAuthenticated, authController.logout);
router.get('/session', authController.session);

router.get('/todos', ensureApiAuthenticated, todoController.list);
router.post('/todos', ensureApiAuthenticated, todoController.create);
router.patch('/todos/:id/toggle', ensureApiAuthenticated, todoController.toggle);
router.delete('/todos/:id', ensureApiAuthenticated, todoController.remove);

module.exports = router;
