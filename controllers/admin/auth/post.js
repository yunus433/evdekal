module.exports = (req, res) => {
  if (req.body && req.body.password) {
    if (process.env.ADMIN_PASSWORD == req.body.password) {
      req.session.admin = true;
      return res.redirect('/admin');
    } else {
      return res.redirect('/admin/login');
    }
  } else {
    return res.redirect('/admin/login');
  }
}
