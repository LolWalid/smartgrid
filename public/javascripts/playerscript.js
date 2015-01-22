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

  if (message.common) {
    newline = '<div class="objectif commun">\
    <strong>'+ message.title +'</strong> : '+ message.description +'</div>'
    $("#objectivesCommon").append(newline)
  }
  else {
    newline = '<div class="objectif individuel">\
    <strong>'+ message.title +'</strong> : '+ message.description +'</div>'
    $("#objectivesIndiv").append(newline)
  }
}