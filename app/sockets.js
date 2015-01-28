function sockets(io, db) {
  io.sockets.on('connection', function(socket) {
    var log = {}
    socket.on('delete player', function(message) {
      log =
      {
        sender : 'Admin',
        receiver : 'Player ' + message.joueur,
        data : message,
        date : new Date().toUTCString()
      }
      socket.broadcast.emit('server logout message', message);
      console.log(log)
    });

    socket.on('new objective', function(message) {
      log =
      {
        sender : 'Admin',
        receiver : 'Player ' + message.joueur,
        data : message,
        date : new Date().toUTCString()
      }
      socket.broadcast.emit('server objective message', message);
      console.log(log)
    });

    socket.on('new event', function(message) {
      log =
      {
        sender : 'Admin',
        receiver : 'Player ' + message.joueur,
        data : message,
        date : new Date().toUTCString()
      }
      socket.broadcast.emit('server event message', message);
      console.log(log)
    });

    socket.on('update view', function(message) {
      log =
      {
        sender : 'Admin',
        receiver : 'Player ' + message.joueur,
        data : message,
        date : new Date().toUTCString()
      }
      socket.broadcast.emit('update view', message);
      console.log(log)
    });

    socket.on('new decision', function(message) {
      log =
      {
        sender : 'Admin',
        receiver : 'Player ' + message.joueur,
        data : message,
        date : new Date().toUTCString()
      }
      socket.broadcast.emit('server decision message', message);
      console.log(log)
    });

    socket.on('response vote', function(message) {
      log =
      {
        sender : 'Player ' + message.joueur,
        receiver : 'Admin',
        data : message,
        date : new Date().toUTCString()
      }
      socket.broadcast.emit('server decision response', message);
      console.log(log)
    });

    socket.on('action on object', function(message) {
      log =
      {
        sender : 'Player ' + message.joueur,
        receiver : 'Admin',
        data : message,
        date : new Date().toUTCString()
      }
      console.log(log)
      socket.broadcast.emit('server action on object', message);
    });
    db.collection('logs').insert(log);
  });
}

module.exports.sockets = sockets;
