function ensureLoggedIn(req, res, next) {
  if (!req.session.user) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.status(401).json({ error: 'Unauthorized' }); // for API/fetch calls
    } else {
      return res.redirect('/login'); // for browser routes
    }
  }
  next();
}


function allowRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.session.user || !allowedRoles.includes(req.session.user.role)) {
      return res.status(403).send("⛔ Access Denied");
    }
    next();
  };
}

module.exports = {
  ensureLoggedIn,
  allowRoles
};
