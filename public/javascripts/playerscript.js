var socket = io.connect('http://localhost:3000')

var objectifsListData = []

var playerData = {}

$(document).ready(function() {
  $.get('http://localhost:3000/player/data', function (data) {
    playerData = data
    console.log(playerData)
  }).done(function () {
    socket.on('server_message', function(message) {
      if (message.joueur == 0 || message.joueur == playerData.id)
        newQuest(message)
    })

    socket.on('update_view', function(message) {
      console.log(message)
      if (message === 'all') {
        $("#valeur_argent").text(playerData.money);
        $("#valeur_energie").text(playerData.energy);
        $("#valeur_satisfaction").text(playerData.satisfaction);
        $("#valeur_score").text(playerData.score);
      }
    })
  })
})

function newQuest(message) {
  $("#new").append('<h3>Nouvel objectif !</h3>')
  $("#new").append('<p><strong>'+message.titre+'</strong><br />')
  $("#new").append(message.description+'</p><br />')
  $("#new").append('<input type="button" id="ok_obj" value="OK" />')
  $("#new").show()

  $("#ok_obj").click(function() {
    addObj(message)
  })
}

function addObj(message) {
  $("#new").empty().hide()
  newline = '<div id="obj" class="obj1"><strong>'+ message.titre +'</strong> : '+ message.description +'</div>'

  if (message.joueur == 0)
    $("#objectivesCommon").append(newline);
  else
    $("#objectivesIndiv").append(newline);
};
