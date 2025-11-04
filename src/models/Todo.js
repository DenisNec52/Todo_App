const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Il titolo è obbligatorio'],
      trim: true,
      maxlength: [120, 'Il titolo non può superare 120 caratteri']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'La descrizione non può superare 1000 caratteri']
    },
    completed: {
      type: Boolean,
      default: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Todo', todoSchema);
