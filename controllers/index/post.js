const moment = require('moment-timezone');

const User = require('../../models/User/User');

module.exports = (req, res) => {
  if (!req.body || !req.body.city)
    return res.redirect('/');

  const ipAddress = req.ip;
  const fiveAm = 18000000;
  const time = Date.now();
  const day =  moment(time-fiveAm).tz("Europe/Istanbul").format("DD[.]MM[.]YYYY");

  const newUserData = {
    ip: day + ":" + ipAddress,
    unixTime: time,
    day,
    city: req.body.city
  }; 

  const newUser = new User(newUserData);

  newUser.save((err, user) => {
    console.log(err, user);
  });
}
