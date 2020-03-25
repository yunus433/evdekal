module.exports = (req, res, next) => {
  if (req.session && req.session.admin) {
    next();
  } else {
    req.session.redirect = req.originalUrl;
    res.redirect('/admin/login');
  };
};
