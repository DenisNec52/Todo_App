const User = require('../models/User');

async function showRegister(req, res) {
  res.render('auth/register', {
    title: 'Registrati',
    values: req.body || {}
  });
}

async function register(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    req.flash('error', 'Le password non coincidono.');
    return res.render('auth/register', {
      title: 'Registrati',
      values: { name, email }
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email già registrata.');
      return res.render('auth/register', {
        title: 'Registrati',
        values: { name },
        errors: {}
      });
    }

    const user = new User({ name, email, password });
    await user.save();
    req.flash('success', 'Registrazione completata. Accedi per iniziare!');
    return res.redirect('/login');
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    const validationErrors = {};
    if (error.name === 'ValidationError') {
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });
    } else {
      req.flash('error', 'Si è verificato un errore inatteso. Riprova.');
    }

    return res.status(400).render('auth/register', {
      title: 'Registrati',
      values: { name, email },
      errors: validationErrors
    });
  }
}

async function showLogin(req, res) {
  res.render('auth/login', {
    title: 'Accedi',
    values: req.body || {}
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Credenziali non valide.');
      return res.render('auth/login', {
        title: 'Accedi',
        values: { email }
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Credenziali non valide.');
      return res.render('auth/login', {
        title: 'Accedi',
        values: { email }
      });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    req.flash('success', `Bentornato ${user.name}!`);
    return res.redirect('/todos');
  } catch (error) {
    console.error('Errore durante il login:', error);
    req.flash('error', 'Si è verificato un errore inatteso. Riprova.');
    return res.status(500).render('auth/login', {
      title: 'Accedi',
      values: { email }
    });
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
}

module.exports = {
  showRegister,
  register,
  showLogin,
  login,
  logout
};
