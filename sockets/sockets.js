const moment = require('moment-timezone');

module.exports = (socket, io) => {
  socket.on('newDataSend', (params, callback) => {
    if (params && params.city && params.day) {
      socket.emit('newData', params);
      callback(false);
    } else {
      callback(true);
    }
  });
};
