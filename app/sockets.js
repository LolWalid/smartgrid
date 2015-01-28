
function addLog(message, db, type) {
  var log =
      {
        sender : 'Admin',
        receiver :  message.joueur ? 'Player ' + message.joueur : 'All Players',
        description : type,
        data : message,
        date : new Date().toUTCString()
      }
  switch (type)
  {
    case 'transaction' :
      log.sender = 'Player ' + message.joueur
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
  console.log(log)
  db.collection('logs').insert(log, function(err, result) {});
}

function sockets(io, db) {
  io.sockets.on('connection', function(socket) {
    socket.on('delete player', function(message) {      
      socket.broadcast.emit('server logout message', message);
      addLog(message, db, 'logout')
    });

    socket.on('new objective', function(message) {
      socket.broadcast.emit('server objective message', message);
      addLog(message, db, 'new objective')
    });

    socket.on('new event', function(message) {
     socket.broadcast.emit('server event message', message);
      addLog(message, db, 'new event')
    });

    socket.on('update view', function(message) {
      socket.broadcast.emit('update view', message);
      addLog(message, db, 'update view')
    });

    socket.on('new decision', function(message) {
      socket.broadcast.emit('server decision message', message);
      addLog(message, db, 'new decision')
    });

    socket.on('response vote', function(message) {
      socket.broadcast.emit('server decision response', message);
      addLog(message, db, 'vote')
    });

    socket.on('action on object', function(message) {
      addLog(message, db, 'transaction')
      socket.broadcast.emit('server action on object', message);
    });
  });
}

module.exports.sockets = sockets;
