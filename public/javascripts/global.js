var socket = io.connect('/')

var playerID

$(document).ready(function() {
  // Récupération ID joueur
  $.get('/players/data', function (data) {
    playerID = data._id
  })

  socket.on('server_decision_message', function (message) {
    if (message.joueur == 0 || message.joueur === playerID)     
      displayDecisionMessage(message)
  })

  socket.on('server_objective_message', function (message) {
    if (message.joueur == 0 || message.joueur === playerID)     
      displayObjectiveMessage(message)
  })
})

function displayDecisionMessage(message) {
  var tableContent = '<div class="new_msg">'
  tableContent += '<h3>Faites un choix</h3>'
  tableContent += '<p><strong>' + message.name + '</strong><br />'
  tableContent += message.description + '</p><br />'
  tableContent += '<input type="button" class="close" value="Close" />'
  tableContent += '</div>'
  $('body').append(tableContent)

  $(".close").click(function() {
    $(this).parent().remove()
  })
}

function displayObjectiveMessage(message) {
  var tableContent = '<div class="new_msg">'
  tableContent += '<h3>Nouvel objectif !</h3>'
  tableContent += '<p><strong>' + message.title + '</strong><br />'
  tableContent += message.description + '</p><br />'
  tableContent += '<input type="button" class="ok_obj" value="OK" />'
  tableContent += '</div>'
  $('body').append(tableContent)

  $(".ok_obj").click(function() {
    $(this).parent().remove()
  })
}