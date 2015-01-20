var socket = io.connect('/')

$(document).ready(function() {
  socket.on('server_decision_message', function(message) {

    var tableContent = '<div class="new_msg">'
    tableContent += '<h3>Faites un choix</h3>'
    tableContent += '<p><strong>' + message.name + '</strong><br />'
    tableContent += message.description + '</p><br />'
    tableContent += '<input type="button" class="close" value="Close" />'
    tableContent += '</div>'
    $('body').append(tableContent)

    $(".close").click(function() {
      $(this).parent().remove();
    })

  })
})
