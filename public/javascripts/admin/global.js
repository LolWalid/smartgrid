var socket = io.connect('/');
var players
var response = []

$(document).ready(function() {
  updatePlayers();
  socket.on('server decision response', function (message) {
    response.push(message);
    updatePlayers();
    receiveDecision();
  })

  socket.on('server buy object', function(message) {
    // get the right player,


    //update his data

    //update db with ajax call

  })
})

function updatePlayers () {
  $.getJSON('/players/list', function (data) {
    players = data;
  });
}


function updateResources() {
  $.getJSON( '/resources/list', function( data ) {
    resources = data
    var tableResources = ''
    $.each(data, function() {
      tableResources += '<option value="' + this.name + '">' + this.name + '</option>'
    })
    $(".resource").html(tableResources)
  })
}
