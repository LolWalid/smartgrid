var socket = io.connect('http://localhost:3000');

var objectifsListData = [];

var playerID;

$(document).ready(function() {
  socket.on('server_message', function(message) {
    $.get('http://localhost:3000/player/data', function (data) {
      playerID = data.id;
    }).done(function () {
      if (message.joueur == 0 || message.joueur == playerID)
        newQuest(message);
    });
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
