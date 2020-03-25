module.exports = (req, res) => {
  return res.render('admin/login', {
    page: 'admin/login',
    title: 'Admin Girişi',
    includes: {
      external: ['css', 'fontawesome']
    }
  });
}
