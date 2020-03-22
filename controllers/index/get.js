module.exports = (req, res) => {
  return res.render('index/index', {
    page: 'index/index',
    title: '#evdekal',
    includes: {
      external: ['js', 'css', 'socket.io', 'fontawesome']
    }
  });
}
