module.exports = (req, res) => {
  return res.render('index/index', {
    page: 'index/index',
    title: 'Evde misin?',
    includes: {
      external: ['js', 'css', 'fontawesome']
    }
  });
}
