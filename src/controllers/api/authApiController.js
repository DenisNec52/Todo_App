const User = require('../../models/User');

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
}

async function register(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Le password non coincidono.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email già registrata.' });
    }

    const user = await User.create({ name, email, password });

    req.session.user = serializeUser(user);

    return res.status(201).json({
      user: serializeUser(user)
    });
  } catch (error) {
    console.error('Errore API durante la registrazione:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Dati non validi.', errors: error.errors });
    }

    return res.status(500).json({ message: 'Errore del server. Riprova più tardi.' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password sono obbligatorie.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenziali non valide.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide.' });
    }

    req.session.user = serializeUser(user);

    return res.json({
      user: serializeUser(user)
    });
  } catch (error) {
    console.error('Errore API durante il login:', error);
    return res.status(500).json({ message: 'Errore del server. Riprova più tardi.' });
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
}

function session(req, res) {
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  }

  return res.json({ user: null });
}

module.exports = {
  register,
  login,
  logout,
  session
};
