const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Il nome è obbligatorio'],
      trim: true,
      minlength: [2, 'Il nome deve contenere almeno 2 caratteri']
    },
    email: {
      type: String,
      required: [true, "L'email è obbligatoria"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Inserisci un'email valida"]
    },
    password: {
      type: String,
      required: [true, 'La password è obbligatoria'],
      minlength: [8, 'La password deve contenere almeno 8 caratteri']
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
