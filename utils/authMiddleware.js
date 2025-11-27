module.exports = {
  ensureLoggedIn: (req, res, next) => {
    if (req.session && req.session.user) return next();
    req.flash('error', 'You must be logged in to do that.');
    return res.redirect('/login');
  },
  ensureAdmin: (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') return next();
    req.flash('error', 'Not authorized.');
    return res.redirect('/posts');
  }
};
