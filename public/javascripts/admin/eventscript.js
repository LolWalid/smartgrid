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
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowevent" rel="' + this._id + '" title="Show Details">' + this.title + '</a></td>';
      tableContent += '<td>' + this.description + '</td>';
      tableContent += '<td>' + (this.common ? "Common" : "Individual") + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteevent" rel="' + this._id + '">Delete</a></td>';
      if (!this.common) {
        tableContent += '<td><select id="sendto" class="form-control">';

        $.each(players, function(){
          tableContent += '<option value="'+ this._id +'">Player '+ this._id +'</option>';
        });
        tableContent += '</select></td>';
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
    console.log(newEvent)

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

function sendEvent(e){
  e.preventDefault();
  var thisEventId = $(this).prop('rel');
  var arrayPosition = eventListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisEventId);
  var thisEventObject = eventListData[arrayPosition];
  var _this = $(this);
  //for (var i = 0; i < thisEventObject.players.length; i++) {
    var eventToSend = {
      joueur: (thisEventObject.common ? 0 : $(this).closest('tr').find("#sendto").val()),
      //'joueur': thisEventObject.common == "true" ? 0 : thisEventObject.players[i],
      title: thisEventObject.title,
      description: thisEventObject.description,
      effects : thisEventObject.effects,
      common : thisEventObject.common
    };

    socket.emit('new event', eventToSend);

    if (thisEventObject.common) {
      updatePlayers();
      $.each(players, function(){
        updatePlayersObjectives(this._id, thisEventObject);
      });
    }
    else {
      var playerId = $(this).closest('tr').find("#sendto").val();
      updatePlayersObjectives(playerId, thisEventObject);
    }

    //console.log("Message envoyé au joueur " + thisEventObject.common == "true" ? 0 : thisEventObject.players[i]);
  //}

}
