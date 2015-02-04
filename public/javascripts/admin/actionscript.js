// Actionlist data array for filling in info box
var actionListData = [];
var players

// DOM Ready =============================================================
$(document).ready(function() {
  // Populate the action table on initial page load
  populateTable();

  // Add ShowActionInfo click
  $('#actionList table tbody').on('click', 'td a.linkshowaction', showActionInfo);

  $('#actionList table tbody').on('click', 'td a.linkdeleteaction', deleteAction);

  $('#displayAddForm').on('click', function () {
    $("#editAction").slideUp(function() {
      $('#editAction input').val('');
      $("#addAction").slideToggle();
    });
  });

  // Add Action button click
  $('#btnAddAction').on('click', addAction);

  // Edit Action button click
  $('#btnEditAction').on('click', editAction);
  $('#actionList table tbody').on('click', 'td a.sendAction', sendAction);

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
  $.getJSON( '/actions/list', function( data ) {
    actionListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      console.log("after each")
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowaction" rel="' + this._id + '" title="Show Details">' + this.title + '</a></td>';
      tableContent += '<td>' + this.description + '</td>';
      tableContent += '<td>' + (this.common ? "Common" : "Individual") + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteaction" rel="' + this._id + '">Delete</a></td>';
      tableContent += '<td><a href="#" class="sendAction" rel="' + this._id + '">Send</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#actionList table tbody').html(tableContent);
  });
};


// Show Action Info
function showActionInfo(action) {

  // Praction Link from Firing
  action.preventDefault();

  $("#addAction").slideUp(function () {
    $("#editAction").slideDown();
  });

  $("#editAction .remove_field").trigger('click');

  // Retrieve actionname from link rel attribute
  var thisActionId = $(this).prop('rel');

  // Get Index of object based on id value
  var arrayPosition = actionListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisActionId);

  // Get our Action Object
  var thisActionObject = actionListData[arrayPosition];

  effects = thisActionObject.effects;


  //Populate Info Box
  $('#actionInfoTitle').text(thisActionObject.title);
  $('#actionInfoDescription').text(thisActionObject.description);

  $('#actionInfoResource').text(thisActionObject.resource);
  $('#actionInfoAchieve').text(thisActionObject.achieve);

  $('#editActionTitle').val(thisActionObject.title);
  $('#editActionDescription').val(thisActionObject.description);
  $('#editActionId').val(thisActionObject._id);


  var tableContent = '';

  if( typeof(effects.length)!="undefined") {
    for( var i = 0; i< effects.length;i++ ) {
      tableContent += '<strong>Resource : </strong>';
      tableContent += '<span>'+ effects[i].resource + '</span><br />';
      tableContent += '<strong>Effect : </strong>';
      tableContent += '<span>'+ effects[i].effect + '</span>';
      tableContent += '<br>';

      $('#editAction .add_input_effects').append('\
        <div class="form-group">\
        <label class="col-sm-2 control-label">Bonus/Malus</label>\
        <div class="col-sm-5">\
        <select class="resource form-control" id="resource' + i + '" value="' + effects[i].resource +'""></select>\
        </div>\
        <div class="col-sm-4">\
        <input type="text" class="effect form-control" placeholder="Other effect of the action" value="' + effects[i].effect +'"">\
        </div>\
        <div class="col-sm-1">\
        <button class="remove_field btn btn-danger"><span>-</span></button>\
        </div>\
        </div>');
      $("#editAction .remove_field").on('click', removeField);
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

// Add Action
function addAction(action) {
  action.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addAction input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    var resources = $('#addAction .resource');
    var effects = $('#addAction .effect');

    var effectsJson = [];

    if( typeof(effects.length)!="undefined") {
      for (var i=0; i<effects.length; i++) {
        var json = {'resource': resources[i].value, 'effect': parseInt(effects[i].value)};
        effectsJson = effectsJson.concat(json);
      }
    }

    var isCommon = $('#addAction input#inputActionCommon').is(":checked")

    // If it is, compile all action info into one object
    var newAction = {
      title : $('#addAction input#inputActionTitle').val(),
      description : $('#addAction textarea#inputActionDescription').val(),
      // achieve : $('#addAction fieldset input#inputActionAchieve').val(),
      // resource : $('#addAction fieldset input#inputActionResource').val(),
      common : isCommon,
      effects : effectsJson
    };

    // Use AJAX to post the object to our addaction service
    $.ajax({
      type: 'POST',
      url: '/actions/add',
      data: JSON.stringify(newAction),
      contentType : 'application/json',
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addAction input').val('');
        $('#addAction textarea').val('');

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


// Delete Action
function deleteAction(action) {

  action.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this action ?');

  // Check and make sure the action confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/actions/delete/' + $(this).prop('rel')
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

// Edit Action
function editAction(action) {
  action.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#editAction input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {
    var resources = $('#editAction .resource');
    var effects = $('#editAction .effect');
    var effectsJson = [];

    if( typeof(effects.length)!="undefined") {
      for (var i=0; i<effects.length; i++) {
        var json = {'resource': resources[i].value, 'effect': effects[i].value};
        effectsJson = effectsJson.concat(json);
      }
    };

    var isCommon = $('#addAction fieldset input#inputActionCommon').is(":checked")

    // If it is, compile all action info into one object
    var actionEdit = {
      id : $('#editAction fieldset input#editActionId').val(),
      title: $('#editAction fieldset input#editActionTitle').val(),
      description: $('#editAction fieldset input#editActionDescription').val(),
      common : isCommon,
      effects : effectsJson
    };

    // Use AJAX to post the object to our editAction service
    $.ajax({
      type: 'POST',
      data: JSON.stringify(actionEdit),
      contentType : 'application/json',
      url: '/actions/edit',
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {
        // Clear the form inputs
        $('#editAction fieldset input').val('');

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
    <input type="text" class="effect form-control" placeholder="Other effect of the action" >\
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

function sendAction(e){
  e.preventDefault();
  var thisActionId = $(this).prop('rel');
  var arrayPosition = actionListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisActionId);
  var thisActionObject = actionListData[arrayPosition];
  if (thisActionObject.common)
    sendThroughSocket(thisActionObject, 0)
  else
    sendToPlayersGUI(thisActionObject)
}

function sendThroughSocket(action, player) {
  var actionToSend = {
    joueur: player,
    title: action.title,
    description: action.description,
    effects : action.effects,
    common : action.common
  };

  if (action.common) {
    updatePlayers();
    $.each(players, function(){
      updatePlayersActions(this._id, actionToSend);
    });
  }
  else {
    updatePlayersActions(player, actionToSend);
  }
}

function updatePlayersActions(id, action) {
  var arrayPosition = players.map(function(arrayItem) { return arrayItem._id; }).indexOf(id);

  player = players[arrayPosition]

  if (player.actions)
    player.actions.push(action)
  else
    player.actions = [action]

  $.ajax({
    type: 'POST',
    contentType : 'application/json',
    data: JSON.stringify(player),
    url: '/players/edit'
  }).done(function(response) {
    if (response.msg === '') {
      console.log('update view')
      socket.emit('update view')
    }
    else {
      console.log('Error: ')
      console.log(response.msg)
    }
  })
}

function addAction(action) {
  console.log(action)
  $.getJSON('/actions/show/' + action, function(data) {
    id = responseObject[action][0].player
    var arrayPosition = players.map(function(arrayItem) { return arrayItem._id; }).indexOf(id)
    var player = players[arrayPosition]
    playerAddAction(player, data)
  })
}
