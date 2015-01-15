var socket = io.connect('http://localhost:3000');

var objectifsListData = [];

var playerID;

$(document).ready(function() {
  // Recuperer id joueur
  $.get('players/data', function (data) {
    playerID = data.id;
    console.log("Joueur n°" + playerID);
  })
  //Remplir la liste d'objectifs
  $.get('objectives/list', function (data) {
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
    })
  //Recevoir nouvel ojectif
  socket.on('server_message', function(message) {
      if (message.joueur == 0 || message.joueur == playerID)
        newQuest(message);
   
  });
});

function newQuest(message) {
  $("#new").append('<h3>Nouvel objectif !</h3>');
  $("#new").append('<p><strong>'+message.titre+'</strong><br />');
  $("#new").append(message.description+'</p><br />');
  $("#new").append('<input type="button" id="ok_obj" value="OK" />');
  $("#new").show();

  $("#ok_obj").click(function() {
    addObj(message);
  });
}

function addObj(message) {
  $("#new").empty().hide();
  newline = '<div id="obj" class="obj1"><strong>'+ message.titre +'</strong> : '+ message.description +'</div>';

  if (message.joueur == 0)
    $("#objectivesCommon").append(newline);
  else
    $("#objectivesIndiv").append(newline);
};
