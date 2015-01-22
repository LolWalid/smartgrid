var decisionList = [];


$(document).ready(function() {
  populateTable();
  $('#addDecision').on('click', addDecision)
  $('#decisionList table tbody').on('click', 'td a.linkdeletedecision', deleteDecision);
  $('#decisionList table tbody').on('click', 'td a.sendDecision', sendDecision);

  $('#displayAddForm').on('click', function () {
    $("#newDecision").slideToggle();
  });
})


function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/decisions/list', function( data ) {
    decisionList = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td>' + this.title + '</td>';
      tableContent += '<td>' + this.description + '</td>';
      tableContent += '<td>' + this.type + '</td>';
      tableContent += '<td><a href="#" class="linkdeletedecision" rel="' + this._id + '">Delete</a></td>';
      tableContent += '<td><a href="#" class="sendDecision" rel="' + this._id + '">Send</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#decisionList table tbody').html(tableContent);
  });
};

function addDecision(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#newDecision input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all objectif info into one object
    var newObjectif = {
      title : $('#newDecision input#inputDecisionTitle').val(),
      type : $('#newDecision select#decisionType').val(),
      description : $('#newDecision textarea#inputDescription').val()
    }
//    newObjectif.effects = effectsJson;

    // Use AJAX to post the object to our addobjectif service
    $.ajax({
      type: 'POST',
      contentType : 'application/json',
      data: JSON.stringify(newObjectif),
      url: '/decisions/add'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#newDecision input').val('');
        $('#newDecision textarea').val('');

        // Update the table
        populateTable();

      }
      else {
        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
};


function deleteDecision(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this decision ?');

  // Check and make sure the objectif confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/decisions/delete/' + $(this).prop('rel')
    }).done(function( response ) {

      // Check for a successful (blank) response
      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }
      // Update the table
      populateTable();

    });

  }
  else {
    // If they said no to the confirm, do nothing
    return false;
  }
};






function sendDecision(event) {
  event.preventDefault()
  var thisDecisionId = $(this).prop('rel')
  var arrayPosition = decisionList.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisDecisionId);
  var thisDecisionObject = decisionList[arrayPosition];
  response = []
  socket.emit('new decision', thisDecisionObject)

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
}
