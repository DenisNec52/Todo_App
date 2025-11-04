function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }

  req.flash('warning', 'Devi effettuare l\'accesso per continuare.');
  return res.redirect('/login');
}

function ensureGuest(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect('/todos');
  }

  return next();
}

module.exports = {
  ensureAuthenticated,
  ensureGuest
};
