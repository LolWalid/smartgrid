// Objectiflist data array for filling in info box
var objectifListData = [];
var players;
var resources;

var socket = io.connect('/');



// DOM Ready =============================================================
ready = $(function() {

  // Fill players options
/*  for (i=1; i <= 10; i++) {
    $('#inputObjectifPlayers').append('<option value="'+ i +'">Player '+ i +'</option>');
  }*/
  // Hide/unhide playerslist
/*  $('#inputObjectifCommon').on('change', function() {
    $('#inputObjectifPlayers').toggle()
  })*/
  // Populate the objectif table on initial page load
  populateTable();

  // Add ShowObjectifInfo click
  $('#objectifList table tbody').on('click', 'td a.linkshowobjectif', showObjectifInfo);

  $('#objectifList table tbody').on('click', 'td a.linkdeleteobjectif', deleteObjectif);

  // Add Objectif button click
  $('#btnAddObjectif').on('click', addObjectif);

  // Edit Objectif button click
  $('#btnEditObjectif').on('click', editObjectif);

  $('#objectifList table tbody').on('click', 'td a.sendobjectif', sendObjectif);

  $('#updateView').on('click', function(event) {
    event.preventDefault();
    socket.emit('update_view', 'all');
  });
});

$(document).ready(ready);
$(document).on('page:load', ready);
// Functions =============================================================


function updatePlayers () {
  $.getJSON('/players/list', function (data) {
    players = data;
  });
}

function updateResources() {
  $.getJSON( '/resources/list', function( data ) {
    resources = data
    var tableResources = ''
    $.each(data, function() {
      tableResources = '<option value="' + this.name + '">' + this.name + '</option>'
    })
    $(".resourceSelect").html(tableResources)
  })
}


// Fill table with data
function populateTable() {

  updatePlayers();
  updateResources();
  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/objectives/list', function( data ) {
    objectifListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowobjectif" rel="' + this._id + '" title="Show Details">' + this.objectifTitle + '</a></td>';
      tableContent += '<td>' + this.description + '</td>';
      tableContent += '<td>' + (this.common ? "commun" : "individuel") + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteobjectif" rel="' + this._id + '">delete</a></td>';
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
      tableContent += '<td><a href="#" class="sendobjectif" rel="' + this._id + '">Send</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#objectifList table tbody').html(tableContent);
  });
};


// Show Objectif Info
function showObjectifInfo(event) {

  // Prevent Link from Firing
  event.preventDefault();

  // Retrieve objectifname from link rel attribute
  var thisObjectifId = $(this).prop('rel');

  // Get Index of object based on id value
  var arrayPosition = objectifListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisObjectifId);

  // Get our Objectif Object
  var thisObjectifObject = objectifListData[arrayPosition];


  //console.log(thisObjectifObject["effects[0][resource]"]);

/*  var tableContent = '';

  if( typeof(effects.length)!="undefined") {
    for( var i = 0; i< effects.length;i++ ) {
      tableContent += '<strong>Ressources : </strong>';
      tableContent += '<span>'+ effects[i].resource + '</span>';
      tableContent += "<br>"
      tableContent += '<strong>Effet : </strong>';
      tableContent += '<span>'+ effects[i].effect + '</span>';
    }
  }

  $('#effects').html(tableContent);
  */

  //Populate Info Box
  $('#objectifInfoTitle').text(thisObjectifObject.objectifTitle);
  $('#objectifInfoDescription').text(thisObjectifObject.description);
  $('#objectifInfoResource').text(thisObjectifObject.resource);
  $('#objectifInfoAchieve').text(thisObjectifObject.achieve);

  $('#editObjectifTitle').val(thisObjectifObject.objectifTitle);
  $('#editObjectifDescription').val(thisObjectifObject.description);
  $('#editObjectifResource').val(thisObjectifObject.resource);
  $('#editObjectifAchieve').val(thisObjectifObject.achieve);
  $('#editObjectifId').val(thisObjectifObject._id);
};

// Add Objectif
function addObjectif(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addObjectif input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

/*    var resources = $('#addObjectif .resource');
    var effects = $('#addObjectif .effect');

    var effectsJson = [];

    if( typeof(effects.length)!="undefined") {
      for (var i=0; i<effects.length; i++) {
        var json = {'resource': resources[i].value, 'effect': effects[i].value};
        effectsJson = effectsJson.concat(json);
      }
    }
    */
    // If it is, compile all objectif info into one object
    var isCommon = $('#addObjectif fieldset input#inputObjectifCommon').is(":checked")
    var newObjectif = {
      objectifTitle : $('#addObjectif fieldset input#inputObjectifTitle').val(),
      description : $('#addObjectif fieldset #inputObjectifDescription').val(),
      achieve : $('#addObjectif fieldset input#inputObjectifAchieve').val(),
      resource : $(this).siblings(".resourceSelect").val(),
      common : isCommon,
      //players : isCommon ? [0] : $('#addObjectif fieldset select#inputObjectifPlayers').val() || []
    }
//    newObjectif.effects = effectsJson;

    // Use AJAX to post the object to our addobjectif service
    $.ajax({
      type: 'POST',
      contentType : 'application/json',
      data: JSON.stringify(newObjectif),
      url: '/objectives/add'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addObjectif fieldset input').not(":checkbox").val('');
        $('#addObjectif fieldset textarea').val('');

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


// Delete Objectif
function deleteObjectif(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this objectif?');

  // Check and make sure the objectif confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/objectives/delete/' + $(this).prop('rel')
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

// Edit Objectif
function editObjectif(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#editObjectif input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all objectif info into one object
    var objectif = {
      'id': $('#editObjectif fieldset input#editObjectifId').val(),
      'objectifTitle': $('#editObjectif fieldset input#editObjectifTitle').val(),
      'description': $('#editObjectif fieldset input#editObjectifDescription').val(),
      'resource': $('#editObjectif fieldset input#editObjectifResource').val(),
      'achieve': $('#editObjectif fieldset input#editObjectifAchieve').val(),
    };

    // Use AJAX to post the object to our editObjectif service
    $.ajax({
      type: 'POST',
      data: objectif,
      url: '/objectives/edit',
      dataType: 'JSON'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {
        // Clear the form inputs
        $('#editObjectif fieldset input').val('');

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
};

function updatePlayersObjectives(playerId, objectif) {
  $.get('/players/show/' + playerId, function (data) {
    if (data.objectives)
      data.objectives.push(objectif);
    else
      data.objectives = [objectif];

    var playerUpdate = {
      id : playerId,
      objectives : data.objectives
    };
    $.ajax({
      type: 'POST',
      data: JSON.stringify(playerUpdate),
      contentType : 'application/json',
      url: '/players/edit',
          //dataType: 'JSON'
        }).done(
        console.log("youpi"));
      });
}

function sendObjectif (event) {
  event.preventDefault();
  var thisObjectifId = $(this).prop('rel');
  var arrayPosition = objectifListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisObjectifId);
  var thisObjectifObject = objectifListData[arrayPosition];
  var _this = $(this);
  //for (var i = 0; i < thisObjectifObject.players.length; i++) {
    var objToSend = {
      joueur: (thisObjectifObject.common ? 0 : $(this).closest('tr').find("#sendto").val()),
      //'joueur': thisObjectifObject.common == "true" ? 0 : thisObjectifObject.players[i],
      titre: thisObjectifObject.objectifTitle,
      description: thisObjectifObject.description,
      common : thisObjectifObject.common
    };

    socket.emit('new_obj', objToSend);

    if (thisObjectifObject.common) {
      updatePlayers();
      $.each(players, function(){
        updatePlayersObjectives(this._id, thisObjectifObject);
      });
    }
    else {
      var playerId = $(this).closest('tr').find("#sendto").val();
      updatePlayersObjectives(playerId, thisObjectifObject);
    }

    //console.log("Message envoyé au joueur " + thisObjectifObject.common == "true" ? 0 : thisObjectifObject.players[i]);
  //}
};


