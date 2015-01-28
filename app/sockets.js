function sockets(io) {
  io.sockets.on('connection', function(socket) {
    socket.on('delete player', function(message) {
      socket.broadcast.emit('server logout message', message);
    });

    socket.on('new objective', function(message) {
      socket.broadcast.emit('server objective message', message);
    });

    socket.on('new event', function(message) {
      socket.broadcast.emit('server event message', message);
    });

    socket.on('update view', function(message) {
      socket.broadcast.emit('update view', message);
    });

    socket.on('new decision', function(message) {
      socket.broadcast.emit('server decision message', message);
    });

    socket.on('response vote', function(message) {
      socket.broadcast.emit('server decision response', message);
    });

    socket.on('action on object', function(message) {
      console.log(message)
      socket.broadcast.emit('server action on object', message);
    });
  });
}

module.exports.sockets = sockets;
