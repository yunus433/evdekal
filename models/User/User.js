const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  type: {
    type: String,
    default: "normal"
  },
  originalIp: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true,
    unique: true
  },
  unixTime: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);
