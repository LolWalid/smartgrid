function addLog(message, db, type) {
  switch(type) {
    case 'transaction':
      addTransaction(message, db)
      break;
    case 'vote':
      addVote(message, db)
      default:
    break;
  }
}

function addTransaction(message, db) {
  log = {
    type: 'transaction',
    sender: message.joueur,
    objectId: message.object,
    action: message.action,
  }

  switch (message.action) {
    case 'buy':
      log.description = 'Player ' + message.joueur + ' bought an object.'
      break
    case 'sale':
      log.description = 'Player ' + message.joueur + ' sold an object.'
      break
    case 'gift':
      log.receiver = message.otherPlayer
      log.description = 'Player ' + message.joueur + ' gave an object' + ' to player ' + message.otherPlayer + '.'
      break
    default:
      break;
  }
  db.collection('logs').insert(log, function(err, result) {
  });
}

function addVote(message, db) {
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

    socket.on('new profile', function(message) {
      socket.broadcast.emit('server profile message', message);
    });

    socket.on('new decision', function(message) {
      socket.broadcast.emit('server decision message', message);
    });

    socket.on('response vote', function(message) {
      addLog(message, db, 'vote')
      socket.broadcast.emit('server decision response', message);
    });

    socket.on('action on object', function(message) {
      addLog(message, db, 'transaction')
      socket.broadcast.emit('server action on object', message);
    });
  });
}

module.exports.sockets = sockets;



/*function addLog(message, db, type) {
  console.log(message)
  var log =
      {
        sender : 'Admin',
        receiver :  (message.joueur ? 'Player ' + message.joueur : 'All Players'),
        description : type,
        data : message,
        date : new Date().toUTCString()
      }
  switch (type)
  {
    case 'transaction' :
      log.sender = 'Player ' + message.joueur
      log.object = message.object
      switch (message.action)
      {
        case 'buy':
          log.description = 'Player ' + message.joueur + ' bought an object'
          break;
        case 'sale':
          log.description = 'Player ' + message.joueur + ' sold an object'
          break;
        case 'gift':
          log.receiver = message.otherPlayer
          log.description = 'Player ' + message.joueur + ' gave an object' + ' to player ' + message.otherPlayer
          break;
        default :
      }
      log.description += ' (object ID : ' + message.object + ' ).'
    break;
    case 'vote' :
      log.sender = 'Player ' + message.joueur
      log.receiver = 'Admin'
      log.description = log.sender + ' voted : ' + message.response
    break;
    default:
  }
  db.collection('logs').insert(log, function(err, result) {});
}
*/
