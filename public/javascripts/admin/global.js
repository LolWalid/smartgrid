var socket = io.connect('/');
var players
var resourcesList
var response = []
var responseObject = []

$(document).ready(function() {
  updatePlayers();
  updateResources();
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

  socket.on('server action triggered', triggerAction)

  $("#init").on('click',initCity)

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
  })
}

function playerAddAction(player, action) {
  joueur = player
  var arrayPosition = joueur.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(action.costResource)

  joueur.resources[arrayPosition].value -= action.price

  $.each(action.effects, function() {
    var arrayPosition = joueur.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(this.resource)
    joueur.resources[arrayPosition].value += this.effect
  })

  if (joueur.actions)
    joueur.actions.push(action)
  else
    joueur.actions = [action]

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
        socket.emit('update view')
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
    // id = responseObject[object][0].player
    // var arrayPosition = players.map(function(arrayItem) { return arrayItem._id; }).indexOf(id)
    // var player = players[arrayPosition]
    if (data.common)
      $.getJSON('/cities/show/city', function(city){
        addObjectToCity(city, data)
      })
  })
}

function hasRespond(joueur, object) {
  var position = responseObject[object].map(function(arrayItem) {return arrayItem.player; }).indexOf(joueur)
  return (position > -1)
}

function sendToPlayersGUI(objToSend) {
  var tableContent = '<div class="message">'
  tableContent += '<div class="message-heading">'
  tableContent += '<h3 class="message-title">'

  if (objToSend.title)
    tableContent += objToSend.title
  else if (objToSend.name)
    tableContent += objToSend.name

  tableContent += '</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<strong>' + 'Select Players' + '</strong><br />'
  tableContent += '<div class="form-group">'
  if (players.length != 0){
    tableContent += '<select multiple class="form-control" id="selectPlayers">'
    $.each(players, function(){
      tableContent += '<option value="' +  this._id + '"> Player ' + this._id + '</option>'
    })
    tableContent += '</select>'
  }
  else
    tableContent += '<p> No player connected, refresh page<p>'

  tableContent += '</div>'
  tableContent += '<input type="button" class="cancel btn btn-lg btn-warning" value="Cancel" />'
  tableContent += '<input type="button" class="ok_obj btn btn-lg btn-success btn-right" value="Send" />'
  tableContent += '</div></div>'
  $('body').append(tableContent)

  $('.cancel').click(function() {
    $(this).closest('.message').remove()
  })

  $(".ok_obj").click(function() {
    var playersSelected = $("#selectPlayers").val()
    $(this).closest('.message').remove()
    if (playersSelected) {
      for (var i = 0; i < playersSelected.length; i++) {
        sendThroughSocket(objToSend, playersSelected[i])
      }
    }
  })
}

function triggerAction(message) {

  var indexOfPlayer = players.map(function(arrayItem) { return arrayItem._id; }).indexOf(message.joueur)
  joueur = players[indexOfPlayer]

  var indexOfAction = joueur.actions.map(function(arrayItem) { return arrayItem._id; }).indexOf(message.action)
  action = joueur.actions[indexOfAction]


  if (indexOfAction > -1 ) {
    joueur.actions.splice(indexOfAction, 1)

    $.each(action.effects, function() {
      var arrayPosition = joueur.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(this.resource)
      joueur.resources[arrayPosition].value += this.effect
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
    console.log('player is cheating')
}


function addObjectToCity(data, object) {
  var city = data
  delete city._id

  var arrayPosition = city.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(object.costResource)

  if (arrayPosition < -1 )
    arrayPosition = city.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf("MoneyShared")

  console.log(city.resources)
  city.resources[0].value -= object.price

  if (city.resources[0].value >= 0) {

    city.objects.push(object)

    updatePlayersResources(object)

    $.ajax({
      type: 'POST',
      contentType : 'application/json',
      data: JSON.stringify(city),
      url: '/cities/edit'
    }).done(function(response) {
      if (response.msg === '') {
        console.log("ok")
        socket.emit('update view')
      }
      else
        console.log('Error: ' + response.msg)
    })
  }
}


function initCity(event) {
  event.preventDefault
  city = {
    name: 'city',
    resources: [],
    objects: [],
    objectives: []
  }
  $.each(resourcesList, function(){
    if (this.shared)
      city.resources.push({name : this.name, unit : this.unit, value : (this.defaultValue ? this.defaultValue : 0)})
  })
  $.ajax({
    url: '/cities/edit',
    type: 'POST',
    data: JSON.stringify(city),
    contentType : 'application/json',
  }).done(function(response){
    if (response.msg != '')
      console.log(response.msg);
  })
}

function updatePlayersResources(object){
  $.each(players, function() {
    joueur = this
    $.each(object.effects, function() {
      var arrayPosition = joueur.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(this.resource)
      joueur.resources[arrayPosition].value += this.effect
      if (joueur.resources[arrayPosition].value < 0)
        joueur.resources[arrayPosition].value = 0
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

  })
}
