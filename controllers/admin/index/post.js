const moment = require('moment-timezone');

const User = require('../../../models/User/User');

const createUser = (city) => {
  const ipAddress = Math.random();
  const threeAm = 10800000;
  const time = Date.now();
  const day =  moment(time-threeAm).tz("Europe/Istanbul").format("DD[.]MM[.]YYYY");

  const newUserData = {
    type: "extra",
    originalIp: day + ":" + ipAddress,
    ip: day + ":1:" + ipAddress,
    unixTime: time,
    day,
    city
  };
  
  const newUser = new User(newUserData);
  
  newUser.save((err, user) => {
    if (err) console.log(err);
    return;
  });
}

module.exports = (req, res) => {
  if (!req.body || !req.body.city || !req.body.number)
    return res.redirect('/admin')

  for (let i = 0; i < req.body.number; i++)
    createUser(req.body.city);
  
    return res.redirect('/admin');
}
