var socket = io.connect('http://localhost:3000');

var objectifsListData = [];

$(document).ready(function() {
  socket.on('server_message', function(message) {
    console.log(message);
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
  console.log(message);
  $("#new").empty().hide();
  newline = '<div id="obj" class="obj1"><strong>'+ message.titre +'</strong> : '+ message.description +'</div>';
  if (message.common == 'true')
    $("#objectivesCommon").append(newline);
  else
    $("#objectivesIndiv").append(newline);
};
