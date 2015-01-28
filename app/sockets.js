function addLog(message, db) {

  log = {
    joueur: message.joueur,
    objectId: message.object
  }

  switch (message.action) {
    case 'buy':
      log.description = 'Player ' + message.joueur + ' bought an object.'
      break
    case 'sale':
      log.description = 'Player ' + message.joueur + ' sold an object.'
      break
    case 'gift':
      log.otherPlayer = message.otherPlayer
      log.description = 'Player ' + message.joueur + ' gave an object' + ' to player ' + message.otherPlayer + '.'
      break
  }

  console.log(log)
  db.collection('logs').insert(log, function(err, result) {
  });
}

function sockets(io, db) {
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
      addLog(message, db)
      socket.broadcast.emit('server action on object', message);
    });
  });
}

module.exports.sockets = sockets;
