// Eventlist data array for filling in info box
var eventListData = [];
var players

// DOM Ready =============================================================
$(document).ready(function() {
  // Populate the event table on initial page load
  populateTable();

  // Add ShowEventInfo click
  $('#eventList table tbody').on('click', 'td a.linkshowevent', showEventInfo);

  $('#eventList table tbody').on('click', 'td a.linkdeleteevent', deleteEvent);

  $('#displayAddForm').on('click', function () {
    $("#editEvent").slideUp(function() {
      $('#editEvent input').val('');
      $("#addEvent").slideToggle();
    });
  });

  // Add Event button click
  $('#btnAddEvent').on('click', addEvent);

  // Edit Event button click
  $('#btnEditEvent').on('click', editEvent);
  $('#eventList table tbody').on('click', 'td a.sendEvent', sendEvent);

  $('.add_field_button').on('click', addField);
  $('.remove_field').on('click', removeField);
});

// Functions =============================================================


// Fill table with data
function populateTable() {

  updatePlayers()
  updateResources();
  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/events/list', function( data ) {
    eventListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      console.log("after each")
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowevent" rel="' + this._id + '" title="Show Details">' + this.title + '</a></td>';
      tableContent += '<td>' + this.description + '</td>';
      tableContent += '<td>' + (this.common ? "Common" : "Individual") + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteevent" rel="' + this._id + '">Delete</a></td>';
      if (!this.common) {
        tableContent += '<td>Select players</td>';
      }
      else   {
        tableContent += '<td>All players</td>';
      }
      tableContent += '<td><a href="#" class="sendEvent" rel="' + this._id + '">Send</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#eventList table tbody').html(tableContent);
  });
};


// Show Event Info
function showEventInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();

  $("#addEvent").slideUp(function () {
    $("#editEvent").slideDown();
  });

  $("#editEvent .remove_field").trigger('click');

  // Retrieve eventname from link rel attribute
  var thisEventId = $(this).prop('rel');

  // Get Index of object based on id value
  var arrayPosition = eventListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisEventId);

  // Get our Event Object
  var thisEventObject = eventListData[arrayPosition];

  effects = thisEventObject.effects;


  //Populate Info Box
  $('#eventInfoTitle').text(thisEventObject.title);
  $('#eventInfoDescription').text(thisEventObject.description);

  $('#eventInfoResource').text(thisEventObject.resource);
  $('#eventInfoAchieve').text(thisEventObject.achieve);

  $('#editEventTitle').val(thisEventObject.title);
  $('#editEventDescription').val(thisEventObject.description);
  $('#editEventId').val(thisEventObject._id);


  var tableContent = '';

  if( typeof(effects.length)!="undefined") {
    for( var i = 0; i< effects.length;i++ ) {
      tableContent += '<strong>Resource : </strong>';
      tableContent += '<span>'+ effects[i].resource + '</span><br />';
      tableContent += '<strong>Effect : </strong>';
      tableContent += '<span>'+ effects[i].effect + '</span>';
      tableContent += '<br>';

      $('#editEvent .add_input_effects').append('\
        <div class="form-group">\
        <label class="col-sm-2 control-label">Bonus/Malus</label>\
        <div class="col-sm-5">\
        <select class="resource form-control" id="resource' + i + '" value="' + effects[i].resource +'""></select>\
        </div>\
        <div class="col-sm-4">\
        <input type="text" class="effect form-control" placeholder="Other effect of the event" value="' + effects[i].effect +'"">\
        </div>\
        <div class="col-sm-1">\
        <button class="remove_field btn btn-danger"><span>-</span></button>\
        </div>\
        </div>');
      $("#editEvent .remove_field").on('click', removeField);
      //updateResources();
      var options = ''

      for (var j = 0; j < resources.length; j++) {

       options += '<option value="' + resources[j].name + '"' + (resources[j].name == effects[i].resource ? 'selected' : '' ) + '>' + resources[j].name + '</option>'
     }
     $('#resource' + i).html(options)
   }
 }


 $('#effects').html(tableContent);

};

// Add Event
function addEvent(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addEvent input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    var resources = $('#addEvent .resource');
    var effects = $('#addEvent .effect');

    var effectsJson = [];

    if( typeof(effects.length)!="undefined") {
      for (var i=0; i<effects.length; i++) {
        var json = {'resource': resources[i].value, 'effect': parseInt(effects[i].value)};
        effectsJson = effectsJson.concat(json);
      }
    }

    var isCommon = $('#addEvent input#inputEventCommon').is(":checked")

    // If it is, compile all event info into one object
    var newEvent = {
      title : $('#addEvent input#inputEventTitle').val(),
      description : $('#addEvent textarea#inputEventDescription').val(),
      // achieve : $('#addEvent fieldset input#inputEventAchieve').val(),
      // resource : $('#addEvent fieldset input#inputEventResource').val(),
      common : isCommon,
      effects : effectsJson
    };

    // Use AJAX to post the object to our addevent service
    $.ajax({
      type: 'POST',
      url: '/events/add',
      data: JSON.stringify(newEvent),
      contentType : 'application/json',
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addEvent input').val('');
        $('#addEvent textarea').val('');

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


// Delete Event
function deleteEvent(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this event ?');

  // Check and make sure the event confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/events/delete/' + $(this).prop('rel')
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

// Edit Event
function editEvent(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#editEvent input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {
    var resources = $('#editEvent .resource');
    var effects = $('#editEvent .effect');
    var effectsJson = [];

    if( typeof(effects.length)!="undefined") {
      for (var i=0; i<effects.length; i++) {
        var json = {'resource': resources[i].value, 'effect': effects[i].value};
        effectsJson = effectsJson.concat(json);
      }
    };

    var isCommon = $('#addEvent fieldset input#inputEventCommon').is(":checked")

    // If it is, compile all event info into one object
    var eventEdit = {
      id : $('#editEvent fieldset input#editEventId').val(),
      title: $('#editEvent fieldset input#editEventTitle').val(),
      description: $('#editEvent fieldset input#editEventDescription').val(),
      common : isCommon,
      effects : effectsJson
    };

    // Use AJAX to post the object to our editEvent service
    $.ajax({
      type: 'POST',
      data: JSON.stringify(eventEdit),
      contentType : 'application/json',
      url: '/events/edit',
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {
        // Clear the form inputs
        $('#editEvent fieldset input').val('');

        // Update the table
        populateTable();

      }
      else {
        // If something goes wrong, alert the error message that our service returned
        console.log('Error: ' + response.msg);
      }
    });
  }
  else {
    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;
  }
  //updateResources()
};


function addField (e) {
  e.preventDefault();
  $(this).parents('.add_input_effects').append('\
    <div class="form-group">\
    <label class="col-sm-2 control-label">Bonus/Malus</label>\
    <div class="col-sm-5">\
    <select class="resource form-control" id="resource"></select>\
    </div>\
    <div class="col-sm-4">\
    <input type="text" class="effect form-control" placeholder="Other effect of the event" >\
    </div>\
    <div class="col-sm-1">\
    <button class="remove_field btn btn-danger"><span>-</span></button>\
    </div>\
    </div>');
  $('.remove_field').last().on('click', removeField);
  updateResources();
}

function removeField(e) {
  e.preventDefault();
  $(this).parents('div.form-group').first().remove();
}


function sendEventGui(event) {
  var tableContent = '<div class="message">'
  tableContent += '<div class="message-heading">'
  tableContent += '<h3 class="message-title">' + event.title + '</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<strong>' + 'Select Players' + '</strong><br />'
  tableContent += '<div class="form-group">'
  if (players.length != 0){
    tableContent += '<select multiple class="form-control" id="selectPlayers">'
    $.each(players, function(){
      tableContent += '<option value="' +  this._id + '"> Player' + this._id + '</option>'
    })
    tableContent += '</select>'
  }
  else
    tableContent += '<p> No player connected, refresh page<p>'

  tableContent += '</div>'
  tableContent += '<input type="button" class="ok_obj btn btn-lg btn-success btn-right" value="OK" />'
  tableContent += '</div></div>'
  $('body').append(tableContent)

  $(".ok_obj").click(function() {
    var playersSelected = $("#selectPlayers").val()
    $(this).closest('.message').remove()
    if (playersSelected) {
      for (var i = 0; i < playersSelected.length; i++) {
        sendThroughSocket(event, playersSelected[i])
      }
    }
  })
}

function sendEvent(e){
  e.preventDefault();
  var thisEventId = $(this).prop('rel');
  var arrayPosition = eventListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisEventId);
  var thisEventObject = eventListData[arrayPosition];
  if (thisEventObject.common)
    sendThroughSocket(thisEventObject, 0)
  else
    sendEventGui(thisEventObject)
}

function sendThroughSocket(event, player) {

  var eventToSend = {
    joueur: player,
    //'joueur': event.common == "true" ? 0 : event.players[i],
    title: event.title,
    description: event.description,
    effects : event.effects,
    common : event.common
  };

  socket.emit('new event', eventToSend);

  if (event.common) {
    updatePlayers();
    $.each(players, function(){
      updatePlayersEvents(this._id, eventToSend);
    });
  }
  else {
    updatePlayersEvents(player, eventToSend);
  }
}

function updatePlayersEvents(id, event) {
  var arrayPosition = players.map(function(arrayItem) { return arrayItem._id; }).indexOf(id);

  player = players[arrayPosition]

  $.each(event.effects, function() {
    var arrayPosition = player.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(this.resource)
    player.resources[arrayPosition].value += this.effect
  })

  $.ajax({
    type: 'POST',
    contentType : 'application/json',
    data: JSON.stringify(player),
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
