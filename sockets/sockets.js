const moment = require('moment-timezone');

module.exports = (socket, io) => {
  socket.on('join', params => {
    socket.join(params.room.toString());
  });

  socket.on('newDataSend', (params, callback) => {
    if (params && params.city && params.day) {
      socket.to(params.to).emit('newData', params);
      setTimeout(() => {
        socket.to(params.to).emit('newData', params);
        callback(false);
      }, 3000);
    } else {
      callback(true);
    }
  });
};
