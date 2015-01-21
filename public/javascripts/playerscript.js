var socket = io.connect('/')

var objectifsListData = []

var playerID
var playerData

$(document).ready(function() {
  // Recuperer data joueur
  $.get('/players/data', function (data) {
    playerData = data
    if (data.objectives)
      for (var i = 0; i < data.objectives.length; i++) {
        addObj(data.objectives[i])
      }
    })

  // Recevoir nouvel objectif
  socket.on('server objective message', function(message) {
    if (message.joueur == 0 || message.joueur === playerData._id)
      addObj(message)
  })
})

function addObj(message) {
  newline = '<div id="obj" class="obj1"><strong>'+ message.title +'</strong> : '+ message.description +'</div>'

  if (message.common)
    $("#objectivesCommon").append(newline)
  else
    $("#objectivesIndiv").append(newline)
}