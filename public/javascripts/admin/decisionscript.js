var socket = io.connect('/')

$(document).ready(function() {

  $('#btnSendDecision').on('click', sendDecision)

})

function sendDecision(event) {
  event.preventDefault()
  var errorCount = 0
  $('#newDecision input').each(function(index, val) {
    if($(this).val() === '') { errorCount++ }
  })

  if (errorCount ===0 ) {
    new_decision = {
      name : $("#inputDecisionName").val(),
      description : $("#inputDescription").val(),
      type : $("#decisionType").val()
    }

    socket.emit('new decision', new_decision)
  }
  else {
    alert('Please fill in all fields')
    return false
  }
}
