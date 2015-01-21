var socket = io.connect('/');
var players
var response = []

$(document).ready(function() {
  updatePlayers();
  socket.on('server decision response', function (message) {
    response[message.joueur] = message;
    updatePlayers();
    receiveDecision();
  })
})

function updatePlayers () {
  $.getJSON('/players/list', function (data) {
    players = data;
  });
}
