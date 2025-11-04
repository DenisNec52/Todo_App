const Todo = require('../models/Todo');

async function listTodos(req, res) {
  try {
    const todos = await Todo.find({ owner: req.session.user.id }).sort({ createdAt: -1 });
    res.render('todos/index', {
      title: 'Le mie attività',
      todos
    });
  } catch (error) {
    console.error('Errore durante il recupero dei todo:', error);
    req.flash('error', 'Impossibile recuperare le attività.');
    res.render('todos/index', {
      title: 'Le mie attività',
      todos: []
    });
  }
}

async function createTodo(req, res) {
  const { title, description, dueDate } = req.body;

  try {
    await Todo.create({
      title,
      description,
      dueDate: dueDate || null,
      owner: req.session.user.id
    });

    req.flash('success', 'Attività creata con successo.');
  } catch (error) {
    console.error('Errore durante la creazione del todo:', error);
    req.flash('error', 'Non è stato possibile creare l\'attività.');
  }

  res.redirect('/todos');
}

async function toggleTodo(req, res) {
  const { id } = req.params;

  try {
    const todo = await Todo.findOne({ _id: id, owner: req.session.user.id });
    if (!todo) {
      req.flash('warning', 'Attività non trovata.');
    } else {
      todo.completed = !todo.completed;
      await todo.save();
      req.flash('success', 'Stato dell\'attività aggiornato.');
    }
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del todo:', error);
    req.flash('error', 'Impossibile aggiornare l\'attività.');
  }

  res.redirect('/todos');
}

async function deleteTodo(req, res) {
  const { id } = req.params;

  try {
    await Todo.deleteOne({ _id: id, owner: req.session.user.id });
    req.flash('success', 'Attività eliminata.');
  } catch (error) {
    console.error('Errore durante l\'eliminazione del todo:', error);
    req.flash('error', 'Impossibile eliminare l\'attività.');
  }

  res.redirect('/todos');
}

module.exports = {
  listTodos,
  createTodo,
  toggleTodo,
  deleteTodo
};
