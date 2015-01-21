// Objectlist data array for filling in info box
var objectListData = [];
var players
var socket = io.connect('/');

// DOM Ready =============================================================
ready  = $(function() {
  // Populate the object table on initial page load
  populateTable();

  // Add ShowObjectInfo click
  $('#objectList table tbody').on('click', 'td a.linkshowobject', showObjectInfo);

  $('#objectList table tbody').on('click', 'td a.linkdeleteobject', deleteObject);

  // Add Object button click
  $('#btnAddObject').on('click', addObject);

  // Edit Object button click
  $('#btnEditObject').on('click', editObject);
    $('#objectList table tbody').on('click', 'td a.sendObject', sendObject);


  $('.add_field_button').on('click', addField);
  $('.remove_field').on('click', removeField);
});

$(document).ready(ready);
$(document).on('page:load', ready);
// Functions =============================================================

function updateResources() {
  $.getJSON( '/resources/list', function( data ) {
    resources = data
    var tableResources = ''
    $.each(data, function() {
      tableResources += '<option value="' + this.name + '">' + this.name + '</option>'
    })
    $(".resource").html(tableResources)
  })
}

function updatePlayers () {
  $.getJSON('/players/list', function (data) {
    players = data;
  });
}

// Fill table with data
function populateTable() {

  updatePlayers()
  updateResources();
  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/objects/list', function( data ) {
    objectListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowobject" rel="' + this._id + '" title="Show Details">' + this.title + '</a></td>';
      tableContent += '<td>' + this.description + '</td>';
      tableContent += '<td>' + (this.common ? "Common" : "Individual") + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteobject" rel="' + this._id + '">Delete</a></td>';
      if (!this.common) {
        tableContent += '<td><select id="sendto">';

        $.each(players, function(){
          tableContent += '<option value="'+ this._id +'">Player '+ this._id +'</option>';
        });
        tableContent += '</select></td>';
      }
      else   {
        tableContent += '<td>All players</td>';
      }
      tableContent += '<td><a href="#" class="sendObject" rel="' + this._id + '">Send</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#objectList table tbody').html(tableContent);
  });
};


// Show Object Info
function showObjectInfo(event) {

  // Probject Link from Firing
  event.preventDefault();

  $("#editObject .remove_field").trigger('click');

  // Retrieve objectname from link rel attribute
  var thisObjectId = $(this).prop('rel');

  // Get Index of object based on id value
  var arrayPosition = objectListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisObjectId);

  // Get our Object Object
  var thisObjectObject = objectListData[arrayPosition];

  effects = thisObjectObject.effects;


  //Populate Info Box
  $('#objectInfoTitle').text(thisObjectObject.title);
  $('#objectInfoDescription').text(thisObjectObject.description);

  $('#objectInfoResource').text(thisObjectObject.resource);
  $('#objectInfoAchieve').text(thisObjectObject.achieve);

  $('#editObjectTitle').val(thisObjectObject.title);
  $('#editObjectDescription').val(thisObjectObject.description);
  $('#editObjectId').val(thisObjectObject._id);


  var tableContent = '';

  if( typeof(effects.length)!="undefined") {
    for( var i = 0; i< effects.length;i++ ) {
      tableContent += '<strong>Resource : </strong>';
      tableContent += '<span>'+ effects[i].resource + '</span><br />';
      tableContent += '<strong>Effect : </strong>';
      tableContent += '<span>'+ effects[i].effect + '</span>';
      tableContent += '<br>';

      $('#editObject .add_input_effects').append('<div>\
        <select id="resource' + i + '" class="resource" value="' + effects[i].resource +'"">\
        <input type="text" class="effect" placeholder="Effect" value="' + effects[i].effect +'"">\
        <a href="#" class="remove_field">Remove</a>\
        </div>');
      $("#editObject .remove_field").on('click', removeField);
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

// Add Object
function addObject(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addObject input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    var resources = $('#addObject .resource').not(".cost");
    var effects = $('#addObject .effect');

    var effectsJson = [];

    if( typeof(effects.length)!="undefined") {
      for (var i=0; i<effects.length; i++) {
        var json = {'resource': resources[i].value, 'effect': parseInt(effects[i].value)};
        effectsJson = effectsJson.concat(json);
      }
    }

    var isCommon = $('#addObject fieldset input#inputObjectCommon').is(":checked")

    // If it is, compile all object info into one object
    var newObject = {
      title : $('#addObject fieldset input#inputObjectTitle').val(),
      description : $('#addObject fieldset textarea#objectDescription').val(),
      common : isCommon,
      costResource : $('#addObject select.cost').val(),
      price : parseInt($('#addObject input#price').val()),
      effects : effectsJson
    };
    console.log(newObject)

    // Use AJAX to post the object to our addobject service
    $.ajax({
      type: 'POST',
      url: '/objects/add',
      data: JSON.stringify(newObject),
      contentType : 'application/json',
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addObject fieldset input').val('');

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


// Delete Object
function deleteObject(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this object ?');

  // Check and make sure the object confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/objects/delete/' + $(this).prop('rel')
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

// Edit Object
function editObject(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#editObject input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {
    var resources = $('#editObject .resource');
    var effects = $('#editObject .effect');
    var effectsJson = [];

    if( typeof(effects.length)!="undefined") {
      for (var i=0; i<effects.length; i++) {
        var json = {'resource': resources[i].value, 'effect': effects[i].value};
        effectsJson = effectsJson.concat(json);
      }
    };

    var isCommon = $('#addObject fieldset input#inputObjectCommon').is(":checked")

    // If it is, compile all object info into one object
    var objectEdit = {
      id : $('#editObject fieldset input#editObjectId').val(),
      title: $('#editObject fieldset input#editObjectTitle').val(),
      description: $('#editObject fieldset input#editObjectDescription').val(),
      common : isCommon,
      effects : effectsJson
    };

    // Use AJAX to post the object to our editObject service
    $.ajax({
      type: 'POST',
      data: JSON.stringify(objectEdit),
      contentType : 'application/json',
      url: '/objects/edit',
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {
        // Clear the form inputs
        $('#editObject fieldset input').val('');

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


function addField (event) {
  event.preventDefault();
  $(this).siblings('.add_input_effects').append('<div>\
    <select class="resource">\
    <input type="text" class="effect" placeholder="Effect">\
    <a href="#" class="remove_field">Remove</a>\
    </div>');
  $(this).siblings('.add_input_effects').children().last().find('.remove_field').on('click', removeField);
  updateResources();
}

function removeField(event) {
  event.preventDefault();
  $(this).parent('div').remove();
}

function sendObject(event){
  event.preventDefault();
  var thisObjectId = $(this).prop('rel');
  var arrayPosition = objectListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisObjectId);
  var thisObjectObject = objectListData[arrayPosition];
  var _this = $(this);
  //for (var i = 0; i < thisObjectObject.players.length; i++) {
    var objectToSend = {
      joueur: (thisObjectObject.common ? 0 : $(this).closest('tr').find("#sendto").val()),
      //'joueur': thisObjectObject.common == "true" ? 0 : thisObjectObject.players[i],
      title: thisObjectObject.title,
      description: thisObjectObject.description,
      effects : thisObjectObject.effects,
      common : thisObjectObject.common
    };

    socket.emit('new object', objectToSend);

    if (thisObjectObject.common) {
      updatePlayers();
      $.each(players, function(){
        updatePlayersObjectives(this._id, thisObjectObject);
      });
    }
    else {
      var playerId = $(this).closest('tr').find("#sendto").val();
      updatePlayersObjectives(playerId, thisObjectObject);
    }

    //console.log("Message envoyé au joueur " + thisObjectObject.common == "true" ? 0 : thisObjectObject.players[i]);
  //}

}
