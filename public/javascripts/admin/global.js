var socket = io.connect('/');
var players
var resourcesList
var response = []
var responseObject = []

$(document).ready(function() {
  updatePlayers();
  socket.on('server decision response', function (message) {
    response.push(message);
    updatePlayers();
    receiveDecision();
  })

  socket.on('server action on object', function(message) {
    playerActionObject(message)
  })
  socket.on('new player', updatePlayers)

  socket.on('server proposition reponse', getResponseObject)
})

function playerActionObject(message) {

  var arrayPosition = players.map(function(arrayItem) { return arrayItem._id; }).indexOf(message.joueur)
  var player = players[arrayPosition]

  $.getJSON('/objects/show/' + message.object, function(data) {
    switch (message.action){
      case 'buy':
      playerBuyObject(player, data)
      break
      case 'sale':
      playerSellObject(player, data)
      break
      case 'gift':
      otherPlayerPosition = players.map(function(arrayItem) { return arrayItem._id; }).indexOf(message.otherPlayer)
      playerGiveObject(player, data, players[otherPlayerPosition])
      break
      case 'proposition':
      playerProposeObject(message, data)
      break
      default:
      console.log("Unknown action")
      break
    }
  })
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

function updatePlayers () {
  $.getJSON('/players/list', function (data) {
    players = data
  });
}

function playerBuyObject(player, object) {
  console.log(player)
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

function playerGiveObject(joueur, object, otherPlayer) {
  var indexOfObject = joueur.objects.map(function(arrayItem) { return arrayItem._id; }).indexOf(object._id)

  if (indexOfObject > -1 ) {
    joueur.objects.splice(indexOfObject, 1)

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
      }
      else
        console.log('Error: ' + response.msg)
    })
  }

  receiver = otherPlayer
  $.each(object.effects, function() {
    var arrayPosition = receiver.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(this.resource)
    receiver.resources[arrayPosition].value += this.effect
  })

  if (receiver.objects)
    receiver.objects.push(object)
  else
    receiver.objects = [object]

  $.ajax({
    type: 'POST',
    contentType : 'application/json',
    data: JSON.stringify(receiver),
    url: '/players/edit'
  }).done(function(response) {
    if (response.msg === '') {
      socket.emit('update view')
    }
    else
      console.log('Error: ' + response.msg)
  })
}

function playerProposeObject(message, data) {
  messagetoSend = message
  messagetoSend.data = data
  responseObject[message.object] = [{player: message.joueur, response: 'Yes'}]

  socket.emit("player want object", messagetoSend)
}

function getResponseObject(message) {
  if (!hasRespond(message.joueur, message.object))
    responseObject[message.object].push({player: message.joueur, response: message.response})

  if (responseObject[message.object].length === players.length)
    buyObject(message.object)
}

function buyObject(object) {
  $.getJSON('/objects/show/' + object, function(data) {
    id = responseObject[object][0].player
    var arrayPosition = players.map(function(arrayItem) { return arrayItem._id; }).indexOf(id)
    var player = players[arrayPosition]
    playerBuyObject(player, data)
  })
}


function hasRespond(joueur, object) {
  var position = responseObject[object].map(function(arrayItem) {return arrayItem.player; }).indexOf(joueur)
  return (position > -1)
}
