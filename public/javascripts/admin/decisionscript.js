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
    response = []
    socket.emit('new decision', new_decision)
  }
  else {
    alert('Please fill in all fields')
    return false
  }
}

function receiveDecision() {

  var responseYes = 0
  var responseNo = 0

  var liYes = ''
  var liNo = ''

  $.each(response, function() {
    if (this.response === 'Oui') {
      liYes += '<li><a href="#">Player ' + this.joueur + '</a></li>'
      responseYes++
    }
    else if (this.response === 'Non'){
      liNo += '<li><a href="#">Player ' + this.joueur + '</a></li>'
      responseNo++
    }
  })

  var tableContentYes = '<div class="dropdown">\
  <button class="btn btn-default dropdown-toggle" type="button" id="reponseYes" data-toggle="dropdown" aria-expanded="true">' +
  'Yes : ' +  responseYes + ' ' +
  '<span class="caret"></span>\
  </button>'

  var tableContentNo =  '<div class="dropdown">\
  <button class="btn btn-default dropdown-toggle" type="button" id="reponseNo" data-toggle="dropdown" aria-expanded="true">' +
  'No :' + responseNo + ' '+
  '<span class="caret"></span>\
  </button>'

  tableContentYes +=  '<ul class="dropdown-menu" role="menu" aria-labelledby="reponseYes">'
  tableContentNo +=  '<ul class="dropdown-menu" role="menu" aria-labelledby="reponseYes">'

  tableContentYes += liYes
  tableContentNo += liNo

  tableContentYes += '</ul></div>'
  tableContentNo += '</ul></div>'
  $("#response").html('');

  if (responseYes != 0 )
    $("#response").append(tableContentYes)
  if (responseNo != 0 )
    $("#response").append(tableContentNo)

  if (response.length === players.length)
    $("#response").append('All Players have responded')
  console.log(players.length)
}
