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

    var arrayPosition = players.map(function(arrayItem) { return arrayItem._id; }).indexOf(message.joueur)
    var player = players[arrayPosition]

    $.getJSON('/objects/show/' + message.object, function(data) {
      updatePlayer(player, data)
    })

    //update his data

    //update db with ajax call

  })
})

function updatePlayers () {
  $.getJSON('/players/list', function (data) {
    players = data
  });
}

function updatePlayer(player, object) {
  //console.log(joueur.resources)

  var joueur = player
  var arrayPosition = joueur.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(object.costResource)

  joueur.resources[arrayPosition].value -= object.price

  $.each(object.effects, function() {
    var arrayPosition = joueur.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(this.resource)
    joueur.resources[arrayPosition].value += this.effect
  })

  if (joueur.objects)
    joueur.objects.push(object)
  else
    joueur.objects = [object]

  joueur.test = 'test'

  $.ajax({
    type: 'POST',
    contentType : 'application/json',
    data: JSON.stringify(joueur),
    url: '/players/edit'
  }).done(function(response) {
    if (response.msg === '') {
      console.log("update view")
      socket.emit('update view')
    }
    else
      console.log('Error: ' + response.msg)
  })
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
