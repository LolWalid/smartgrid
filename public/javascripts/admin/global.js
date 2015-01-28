var socket = io.connect('/');
var players
var resourcesList
var response = []

$(document).ready(function() {
  updatePlayers();
  socket.on('server decision response', function (message) {
    response.push(message);
    updatePlayers();
    receiveDecision();
  })

  socket.on('server action on object', function(message) {

    var arrayPosition = players.map(function(arrayItem) { return arrayItem._id; }).indexOf(message.joueur)
    var player = players[arrayPosition]

    $.getJSON('/objects/show/' + message.object, function(data) {
      switch (message.action){
        case 'buy' :
        playerBuyObject(player, data)
        break
        case 'sell' :
        playerSellObject(player, data)
        break
      }
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

function playerBuyObject(player, object) {

  joueur = player
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

function playerSellObject(joueur, object) {

  var indexOfObject = joueur.objects.map(function(arrayItem) { return arrayItem._id; }).indexOf(object._id)

  if (indexOfObject > -1 ) {
    joueur.objects.splice(indexOfObject, 1)

    var arrayPosition = joueur.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(object.costResource)
    joueur.resources[arrayPosition].value += 0.5 * object.price



    $.each(object.effects, function() {
      var arrayPosition = joueur.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(this.resource)
      joueur.resources[arrayPosition].value -= this.effect
    })

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
  else
    console.log("Player is cheating.")
}

function updateResources() {
  $.getJSON( '/resources/list', function( data ) {
    resourcesList = data
    var tableResources = ''
    $.each(data, function() {
      tableResources += '<option value="' + this.name + '">' + this.name + '</option>'
    })
    $(".resource").html(tableResources)
  })
}
