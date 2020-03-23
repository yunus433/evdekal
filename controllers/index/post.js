const moment = require('moment-timezone');

const User = require('../../models/User/User');

module.exports = (req, res) => {
  if (!req.body || !req.body.city) {
    res.json({ "err": "bad request" });
    return res.status(200);
  }

  if (req.session && req.session.sent) {
    res.json({ "err": "second time" });
    return res.status(200);
  }

  const ipAddress = req.ip;
  const threeAm = 10800000;
  const time = Date.now();
  const day =  moment(time-threeAm).tz("Europe/Istanbul").format("DD[.]MM[.]YYYY");

  User.find({
    originalIp: day + ":" + ipAddress
  }, (err, users) => {
    if (err || users.length > 4) {
      res.json({ "err": "already sent" });
      return res.status(200);
    }

    const newUserData = {
      originalIp: day + ":" + ipAddress,
      ip: day + ":" + (users.length+1) + ":" + ipAddress,
      unixTime: time,
      day,
      city: req.body.city
    };
  
    const newUser = new User(newUserData);
  
    newUser.save((err, user) => {
      if (err && err.code == 11000) {
        res.json({ "err": "already sent" });
        return res.status(200);
      } else if (err) {
        res.json({ "err": "unknown" });
        return res.status(200);
      } else {
        req.session.sent = true;
        res.json({ user });
        return res.status(200);
      }
    });
  });
}
