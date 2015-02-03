function addLog(message, db, type) {
  switch(type) {
    case 'transaction':
      addTransaction(message, db)
      break;
    case 'vote':
      addVote(message, db)
    case 'proposition':
      addTransaction(message, db)
    break;
    case 'proposition response':
      addPropositionResponse(message, db)
    break;
    default:
    break;

  }
}
function addPropositionResponse(message, db){
  var log = {
    type : 'proposition response',
    sender : message.joueur,
    receiver : 'Admin',
    objectId : message.object,
    response : message.response,
    description : message.joueur + ' answered : ' +   
    date : new Date().toUTCString()
  }
  db.collection('logs').insert(log, function(err, result) {});
}

function addTransaction(message, db) {
  var log = {
    type : 'transaction',
    action : message.action,
    sender : message.joueur,
    receiver : 'Admin',
    objectId : message.object,
    date : new Date().toUTCString()
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
    case 'proposition':
      log.description = 'Player ' + message.joueur + ' want community to buy an object.'
      break
    default:
      break
  }
  log.date = new Date().toUTCString()
  db.collection('logs').insert(log, function(err, result) {
  });
}

function addVote(message, db) {
  var log = {
    type: 'vote',
    sender : message.joueur,
    receiver : 'Admin',
    description : message.joueur + ' voted : ' + message.response,
    date : new Date().toUTCString()
  }
  db.collection('logs').insert(log, function(err, result) {})
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

    socket.on('player want object', function(message) {
      addLog(message, db, 'proposition')
      socket.broadcast.emit('server player want object', message);
    });

    socket.on('proposition reponse', function(message) {
      addLog(message, db, 'proposition response')
      socket.broadcast.emit('server proposition reponse', message);
    });
  });
}

module.exports.sockets = sockets;