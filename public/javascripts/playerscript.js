var socket = io.connect('http://localhost:3000')

var objectifsListData = []

var playerID;
var playerData;

$(document).ready(function() {
  // Recuperer id joueur
  $.get('/players/data', function (data) {
    playerID = data._id;
    playerData = data;
    console.log("Joueur n°" + playerID);
    if (data.objectives)
      for (var i = 0; i < data.objectives.length; i++) {
        addObj(data.objectives[i])
      }
  })
  //Remplir la liste d'objectifs
  /*  $.get('objectives/list', function (data) {
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].players.indexOf(playerID))
        if (data[i].common == "true"  || data[i].players.indexOf(playerID) != -1){
        var obj =
        {
          'joueur': data[i].common == "true" ? 0 : data[i].players[i],
          'titre': data[i].objectifTitle,
          'description': data[i].description
        }
        addObj(obj)
      }
    }
  })*/


  //Recevoir nouvel ojectif
  socket.on('server_message', function(message) {
    if (message.joueur == 0 || message.joueur == playerID)
      newQuest(message);

  });
  socket.on('update_view', function(message) {
    console.log(message)
    if (message === 'all') {
      $("#valeur_argent").text(playerData.money);
      $("#valeur_energie").text(playerData.energy);
      $("#valeur_satisfaction").text(playerData.satisfaction);
      $("#valeur_score").text(playerData.score);
    }
  })
});


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

  if (message.common === "true")
    $("#objectivesCommon").append(newline);
  else
    $("#objectivesIndiv").append(newline);
};
