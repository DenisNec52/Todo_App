const Todo = require('../../models/Todo');

function serializeTodo(todo) {
  return {
    _id: todo._id,
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    dueDate: todo.dueDate,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt
  };
}

async function list(req, res) {
  try {
    const todos = await Todo.find({ owner: req.session.user.id }).sort({ createdAt: -1 });
    return res.json({ todos: todos.map(serializeTodo) });
  } catch (error) {
    console.error('Errore API durante la lettura dei todo:', error);
    return res.status(500).json({ message: 'Impossibile recuperare le attività.' });
  }
}

async function create(req, res) {
  const { title, description, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Il titolo è obbligatorio.' });
  }

  try {
    const todo = await Todo.create({
      title,
      description: description || '',
      dueDate: dueDate || null,
      owner: req.session.user.id
    });

    return res.status(201).json({ todo: serializeTodo(todo) });
  } catch (error) {
    console.error('Errore API durante la creazione del todo:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dati non validi.', errors: error.errors });
    }

    return res.status(500).json({ message: "Non è stato possibile creare l'attività." });
  }
}

async function toggle(req, res) {
  const { id } = req.params;

  try {
    const todo = await Todo.findOne({ _id: id, owner: req.session.user.id });
    if (!todo) {
      return res.status(404).json({ message: 'Attività non trovata.' });
    }

    todo.completed = !todo.completed;
    await todo.save();

    return res.json({ todo: serializeTodo(todo) });
  } catch (error) {
    console.error("Errore API durante l'aggiornamento del todo:", error);
    return res.status(500).json({ message: "Impossibile aggiornare l'attività." });
  }
}

async function remove(req, res) {
  const { id } = req.params;

  try {
    const { deletedCount } = await Todo.deleteOne({ _id: id, owner: req.session.user.id });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Attività non trovata.' });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Errore API durante l'eliminazione del todo:", error);
    return res.status(500).json({ message: "Impossibile eliminare l'attività." });
  }
}

module.exports = {
  list,
  create,
  toggle,
  remove
};
