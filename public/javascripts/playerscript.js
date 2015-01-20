//var socket = io.connect('http://localhost:3000')
var socket = io.connect('/')

var objectifsListData = []

var playerID
var playerData

$(document).ready(function() {
  // Recuperer id joueur
  $.get('/players/data', function (data) {
    playerID = data._id
    playerData = data
    console.log("Joueur n°" + playerID)
    if (data.objectives)
      for (var i = 0; i < data.objectives.length; i++) {
        addObj(data.objectives[i])
      }
    })

  // Recevoir nouvel ojectif
  socket.on('server_objective_message', function(message) {
    if (message.joueur == 0 || message.joueur === playerID)
      newQuest(message)
  })

  // Recevoir nouvel event
  socket.on('server_event_message', function(message) {
    if (message.joueur == 0 || message.joueur === playerID)
      newEvent(message)
  })

  // Recevoir message de déconnexion (admin)
  socket.on('server_logout_message', function(message){
    if (message.player === playerID)
      newLogout(message)
  })

  socket.on('update_view', function(message) {
    console.log(message)
    if (message === 'all') {
      $("#valeur_argent").text(playerData.money)
      $("#valeur_energie").text(playerData.energy)
      $("#valeur_satisfaction").text(playerData.satisfaction)
      $("#valeur_score").text(playerData.score)
    }
  })
})

function newQuest(message) {
  $("body").append("<div class='new_msg'></div>")
  $(".new_msg").append('<h3>Nouvel objectif !</h3>')
  $(".new_msg").append('<p><strong>'+message.objectifTitle+'</strong><br />')
  $(".new_msg").append(message.description+'</p><br />')
  $(".new_msg").append('<input type="button" id="ok_obj" value="OK" />')

  $("#ok_obj").click(function() {
    addObj(message)
    $('.new_msg').remove()
  })
}

function newEvent(message) {
  $("body").append("<div class='new_msg'></div>")
  $(".new_msg").append('<h3>Nouvel Évènement !</h3>')
  $(".new_msg").append('<p><strong>'+message.titre+'</strong><br />')
  $(".new_msg").append(message.description+'</p><br />')
  $(".new_msg").append('<input type="button" id="ok_event" value="OK" />')
  $(".new_msg").append('<input type="button" id="not_ok_event" value="NOT OK" />')

  $("#ok_event").click(function() {
    updatePlayer(message)
    $('.new_msg').remove()
  })
}

function newLogout(message) {
  $("body").append("<div class='new_msg'></div>")
  $(".new_msg").append('<h3>Oups !</h3>')
  $(".new_msg").append('<p><strong>Vous allez être déconnecté.</strong><br />')
  $(".new_msg").append('L\'administrateur vient de forcer votre déconnexion.</p><br />')
  $(".new_msg").append('<input type="button" id="ok_event" value="OK" />')

  $("#ok_event").click(function() {
    $('.new_msg').remove()
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
}

function addObj(message) {

  newline = '<div id="obj" class="obj1"><strong>'+ message.objectifTitle +'</strong> : '+ message.description +'</div>'

  if (message.common)
    $("#objectivesCommon").append(newline)
  else
    $("#objectivesIndiv").append(newline)
}

function updatePlayer (message) {
    // If it is, compile all event info into one object
    var playerEdit = playerData

    // $.each(playerEdit.resources, function(){
    //   for (var i = 0 i < message.effects.length i++) {
    //    if(message.effects[i].resource == this.resource)
    //     this.quantity += message.effects[i].effect
    //   }
    // })

    // Use AJAX to post the object to our editEvent service
    $.ajax({
      type: 'POST',
      data: JSON.stringify(playerEdit),
      contentType : 'application/json',
      url: '/players/edit',
    }).done(function( response ) {
      // Check for successful (blank) response
      if (response.msg !== '') {
        // If something goes wrong, alert the error message that our service returned
        console.log('Error: ' + response.msg)
      }
    })
  }
