const express = require('express');
const { ensureAuthenticated } = require('../middleware/auth');
const todoController = require('../controllers/todoController');

const router = express.Router();

router.get('/', ensureAuthenticated, todoController.listTodos);
router.post('/', ensureAuthenticated, todoController.createTodo);
router.post('/:id/toggle', ensureAuthenticated, todoController.toggleTodo);
router.post('/:id/delete', ensureAuthenticated, todoController.deleteTodo);

module.exports = router;
