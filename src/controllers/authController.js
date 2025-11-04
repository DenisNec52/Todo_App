const User = require("../models/User");

function renderWithMessages(res, view, locals, { status, type, message } = {}) {
  const baseMessages = res.locals.messages || {};
  const messages = { ...baseMessages };

  if (type && message) {
    messages[type] = [...(messages[type] || []), message];
  }

  const response = typeof status === "number" ? res.status(status) : res;

  return response.render(view, {
    ...locals,
    messages
  });
}

async function showRegister(req, res) {
  return renderWithMessages(res, "auth/register", {
    title: "Registrati",
    values: req.body || {}
  });
}

async function register(req, res) {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return renderWithMessages(
      res,
      "auth/register",
      {
        title: "Registrati",
        values: { name, email }
      },
      {
        status: 400,
        type: "error",
        message: "Le password non coincidono."
      }
    );
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return renderWithMessages(
        res,
        "auth/register",
        {
          title: "Registrati",
          values: { name },
          errors: {}
        },
        {
          status: 400,
          type: "error",
          message: "Email già registrata."
        }
      );
    }

    const user = new User({ name, email, password });
    await user.save();
    req.flash("success", "Registrazione completata. Accedi per iniziare!");
    return res.redirect("/login");
  } catch (error) {
    console.error("Errore durante la registrazione:", error);
    const validationErrors = {};
    let generalErrorMessage;

    if (error.name === "ValidationError") {
      Object.keys(error.errors).forEach((key) => {
        validationErrors[key] = error.errors[key].message;
      });
    } else {
      generalErrorMessage = "Si è verificato un errore inatteso. Riprova.";
    }

    return renderWithMessages(
      res,
      "auth/register",
      {
        title: "Registrati",
        values: { name, email },
        errors: validationErrors
      },
      generalErrorMessage
        ? {
            status: 400,
            type: "error",
            message: generalErrorMessage
          }
        : { status: 400 }
    );
  }
}

async function showLogin(req, res) {
  return renderWithMessages(res, "auth/login", {
    title: "Accedi",
    values: req.body || {}
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return renderWithMessages(
        res,
        "auth/login",
        {
          title: "Accedi",
          values: { email }
        },
        {
          status: 401,
          type: "error",
          message: "Credenziali non valide."
        }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return renderWithMessages(
        res,
        "auth/login",
        {
          title: "Accedi",
          values: { email }
        },
        {
          status: 401,
          type: "error",
          message: "Credenziali non valide."
        }
      );
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    req.flash("success", `Bentornato ${user.name}!`);
    return res.redirect("/todos");
  } catch (error) {
    console.error("Errore durante il login:", error);
    return renderWithMessages(
      res,
      "auth/login",
      {
        title: "Accedi",
        values: { email }
      },
      {
        status: 500,
        type: "error",
        message: "Si è verificato un errore inatteso. Riprova."
      }
    );
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
}

module.exports = {
  showRegister,
  register,
  showLogin,
  login,
  logout
};
