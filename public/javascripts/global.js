var socket = io.connect('/')

var playerData
var players = []

var eventUpdate = new CustomEvent(
  "update",
  {
    detail: {
      message: "update",
      time: new Date(),
    },
    bubbles: true,
    cancelable: true
  }
  )

$(document).ready(function() {
  // Récupération data joueur
  updatePlayerView()
  updatePlayers()

  // Recevoir message de nouveau profil
  socket.on('server profile message', function (message) {
    if (message.joueur === playerData._id)
      displayProfileMessage(message)
  })

  // Recevoir message de décision
  socket.on('server decision message', function (message) {
    displayDecisionMessage(message)
  })

  // Recevoir nouvel objectif
  socket.on('server objective message', function (message) {
    if (message.joueur == 0 || message.joueur === playerData._id)
      displayObjectiveMessage(message)
  })

  // Recevoir nouvel event
  socket.on('server event message', function(message) {
    if (message.joueur == 0 || message.joueur === playerData._id)
      displayEventMessage(message)
  })

  // Recevoir message de déconnexion (admin)
  socket.on('server logout message', function(message){
    if (message.player === playerData._id)
      displayLogoutMessage(message)
  })

  socket.on('update view', function (message) {
    updatePlayerView()
  })

  socket.on('server player want object', function (message) {
    displayPropositionGui(message, false)
  })

  socket.on('server new object city', function (message) {
    displayPropositionGui(message, true)
  })

  socket.on('new player', updatePlayers)

  document.addEventListener("update", updateNavBar, false);
})

function updatePlayer (message) {
  var playerEdit = playerData

  // Use AJAX to post the object to our editEvent service
  $.ajax({
    type: 'POST',
    data: JSON.stringify(playerEdit),
    contentType : 'application/json',
    url: '/players/edit'
  }).done(function( response ) {
    // Check for successful (blank) response
    if (response.msg !== '') {
      // If something goes wrong, alert the error message that our service returned
      console.log('Error: ' + response.msg)
    }
  })
}

function updatePlayers () {
  $.getJSON('/players/connectedlist', function (data) {
    players = data
  });
}

function getValue(name) {
  var arrayPosition = playerData.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(name)
  return playerData.resources[arrayPosition] ? playerData.resources[arrayPosition].value : 'NOT IN DB';
}


function updatePlayerView() {
  $.get('/players/data', function (data) {
    playerData = data
  }).done(function (response) {
    document.dispatchEvent(eventUpdate)
  })
}

function updateNavBar() {
  $("#valeur_argent").text(" " + getValue("Money"))
  $("#valeur_energie").text(" " + getValue("Energy"))
  $("#valeur_satisfaction").text(" " + getValue("Satisfaction"))
  $("#valeur_score").text(" " + getValue("Score"))
  if (playerData.profile)
    $("#profileImage").attr('src', '/img/perso/'+playerData.profile.image);
}

function displayProfileMessage(message) {
  var tableContent = '<div class="message objective">'
  tableContent += '<div class="message-heading">'
  tableContent += '<h3 class="message-title">Nouveau profil !</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<p>Vous êtes maintenant ' + message.profile.name + ', ' + message.profile.profession + '<br />'
  tableContent += message.profile.description + '</p><br />'
  tableContent += '<input type="button" class="ok_profile btn btn-lg btn-success btn-right" value="OK" />'
  tableContent += '</div></div>'
  $('body').append(tableContent)

  $(".ok_profile").click(function() {
    $(this).closest('.message').remove()
    document.location.reload()
  })
}

function displayDecisionMessage(message) {

  var tableContent = '<div class="message decision">'
  tableContent += '<div class="message-heading">'

  tableContent += '<h3 class="message-title">Nouvelle décision à prendre</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<p><strong>' + message.title + '</strong><br />'
  tableContent += message.description + '</p><br />'

  if (message.type === 'Concensus')
    tableContent += '<input type="button" class="closeMessage" value="Close" />'
  else {
    tableContent += '<input type="button" class="btn btn-success vote" value="Oui" /><span> </span>'
    tableContent += '<input type="button" class="btn btn-danger vote" value="Non" />'
  }

  tableContent += '</div></div>'
  $('body').append(tableContent)

  $('.vote').on('click',sendResponse)

  $(".closeMessage").click(function() {
    $(this).closest('.message').remove()
  })
}

function sendResponse(event) {
  event.preventDefault
  socket.emit('response vote', {joueur : playerData._id, response : $(this).val()})
  $(this).closest('.message').remove()
}

function displayObjectiveMessage(message) {
  var tableContent = '<div class="message objective">'
  tableContent += '<div class="message-heading">'
  tableContent += '<h3 class="message-title">Nouvel objectif !</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<p><strong>' + message.title + '</strong><br />'
  tableContent += message.description + '</p><br />'
  tableContent += '<input type="button" class="ok_obj btn btn-lg btn-success btn-right" value="OK" />'
  tableContent += '</div></div>'
  $('body').append(tableContent)

  $(".ok_obj").click(function() {
    $(this).closest('.message').remove()
  })
}

function displayEventMessage(message) {
  var tableContent = '<div class="message event">'
  tableContent += '<div class="message-heading">'
  tableContent += '<h3 class="message-title">Nouvel Évènement !</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<p><strong>' + message.title + '</strong><br />'
  tableContent += message.description + '</p><br />'
  tableContent += '<input type="button" class="ok_event btn btn-lg btn-warning btn-right" value="OK" />'
  tableContent += '<input type="button" id="not_ok_event" value="NOT OK" />'
  tableContent += '</div></div>'
  $('body').append(tableContent)

  $(".ok_event").click(function() {
    $(this).closest('.message').remove()
  })
}

function displayLogoutMessage(message) {
  var tableContent = '<div class="message logout">'
  tableContent += '<div class="message-heading">'
  tableContent += '<h3 class="message-title">Oups !</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<p><strong>Vous allez être déconnecté.</strong><br />'
  tableContent += 'L\'administrateur vient de forcer votre déconnexion.</p><br />'
  tableContent += '</div></div>'
  $('body').append(tableContent)
  setInterval(function(){
    $.each(players, function() {
      $.ajax({
        url: '/logout',
        type: 'POST',
        dataType: 'json',
      }).done(function( response ) {
        if (response.msg === 'done') {
          window.location.href = '/'
        }
      })
    })
  }, 3000)
}

function displayPropositionGui(message, hasBeenBought) {
  //add popin with a yes or no button
  object = message.data
  console.log(message)

  tableContent = '<div class="message-heading">'
  if (hasBeenBought)
    tableContent += '<h3 class="message-title">Nouvel objet pour la ville : ' + object.title + '</h3>'
  else
    tableContent += '<h3 class="message-title">' + 'Le joueur ' + message.joueur + ' souhaite acheter un objet pour la ville.' + '</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<h3>' + object.title + '</h3>'
  tableContent += '<p>' + object.description + '</p><br />'
  tableContent += '<p>Prix   : ' + object.price + (object.costUnit ? object.costUnit : '') + '</p>'
  tableContent += "<h4>Effets</h4>"
  tableContent += "<ul>"
  $.each(object.effects, function() {
    tableContent +='<li>' + this.resource + ' : '
    tableContent += (this.effect >= 0 ? '+' + this.effect : this.effect)
    tableContent += ' ' + (this.unit ? this.unit : '')
    tableContent += '</li>'
  })

  tableContent += "</ul>"
  if (hasBeenBought)
    tableContent += '<input type="button" class="closeMessage btn btn-lg btn-success btn-left" value="OK" />'
  else {
    tableContent += '<p> Etes vous d\'accord pour cet achat ?</p>'
    tableContent += '<input type="button" class="ok_obj btn btn-lg btn-success btn-left" value="Oui" />'
    tableContent += '<input type="button" class="ok_obj btn btn-lg btn-danger btn-right" value="Non" />'
  }
  tableContent += '</div>'
  //tableContent += '<input type="button" class="linkbuyobject btn btn-lg btn-warning btn-left" value="Acheter" />'


  $('body').append('<div class="message objective popin">' + tableContent + '</div>')

  $(".ok_obj").click(function() {
    response = {
      joueur: playerData._id,
      object: message.object,
      response: $(this).val()
    }
    socket.emit('proposition response', response)
    $(this).closest('.message').remove()
  })
  $('.closeMessage').click(function() {
    $(this).closest('.message').remove()
  })
}
