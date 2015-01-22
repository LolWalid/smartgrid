// Objectiflist data array for filling in info box
var objectifListData = [];
var players;
var resources;

// DOM Ready =============================================================
$(document).ready(function() {

  // Fill players options

  // Populate the objectif table on initial page load
  populateTable();

  // Add ShowObjectifInfo click
  $('#objectifList table tbody').on('click', 'td a.linkshowobjectif', showObjectifInfo);

  $('#objectifList table tbody').on('click', 'td a.linkdeleteobjectif', deleteObjectif);

  $('#displayAddForm').on('click', function () {
    $("#editObjectif").slideUp(function() {
    $('#editObjectif input').val('');
      $("#addObjectif").slideToggle();
    });
  });

  // Add Objectif button click
  $('#btnAddObjectif').on('click', addObjectif);

  // Edit Objectif button click
  $('#btnEditObjectif').on('click', editObjectif);

  $('#objectifList table tbody').on('click', 'td a.sendobjectif', sendObjectif);
});


// Functions =============================================================

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
      tableContent += '<td><a href="#" class="linkshowobjectif" rel="' + this._id + '" title="Show Details">' + this.title + '</a></td>';
      tableContent += '<td>' + this.description + '</td>';
      tableContent += '<td>' + (this.common ? "Common" : "Individual") + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteobjectif" rel="' + this._id + '">Delete</a></td>';
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

  $("#addObjectif").slideUp(function () {
    $("#editObjectif").slideDown();
  });

  // Retrieve objectifname from link rel attribute
  var thisObjectifId = $(this).prop('rel');

  // Get Index of object based on id value
  var arrayPosition = objectifListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisObjectifId);

  // Get our Objectif Object
  var thisObjectifObject = objectifListData[arrayPosition];

  //Populate Info Box
  $('#objectifInfoTitle').text(thisObjectifObject.title);
  $('#objectifInfoDescription').text(thisObjectifObject.description);
  $('#objectifInfoResource').text(thisObjectifObject.resource);
  $('#objectifInfoAchieve').text(thisObjectifObject.achieve);
  $('#objectifInfoReward').text(thisObjectifObject.reward);
  $('#objectifInfoRewardValue').text(thisObjectifObject.rewardValue);

  $('#editObjectifTitle').val(thisObjectifObject.title);
  $('#editObjectifDescription').val(thisObjectifObject.description);
  $('#editObjectifResource').val(thisObjectifObject.resource);
  $('#editObjectifAchieve').val(thisObjectifObject.achieve);
  $('#editObjectifRewardResource').val(thisObjectifObject.reward);
  $('#editObjectifRewardValue').val(thisObjectifObject.rewardValue);
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

    // If it is, compile all objectif info into one object
    var isCommon = $('#addObjectif input#inputObjectifCommon').is(":checked")
    var newObjectif = {
      title : $('#addObjectif #inputObjectifTitle').val(),
      description : $('#addObjectif #inputObjectifDescription').val(),
      achieve : $('#addObjectif #inputObjectifAchieve').val(),
      resource : $('#addObjectif #inputObjectifResource').val(),
      reward : $('#addObjectif #inputObjectifRewardResource').val(),
      rewardValue : $('#addObjectif #inputObjectifRewardValue').val(),
      common : isCommon,
    }

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
        $('#addObjectif input').not(":checkbox").val('');
        $('#addObjectif textarea').val('');

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
  var confirmation = confirm('Are you sure you want to delete this objective ?');

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

  $("#addObjectif").hide();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#editObjectif input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all objectif info into one object
    var objectif = {
      'id': $('#editObjectif #editObjectifId').val(),
      'title': $('#editObjectif #editObjectifTitle').val(),
      'description': $('#editObjectif #editObjectifDescription').val(),
      'resource': $('#editObjectif #editObjectifResource').val(),
      'achieve': $('#editObjectif input#editObjectifAchieve').val(),
      'reward': $('#editObjectif #editObjectifRewardResource').val(),
      'rewardValue': $('#editObjectif #editObjectifRewardValue').val()
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

        $('#editObjectif input').not(":checkbox").val('');
        $('#editObjectif textarea').val('');

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
  var objToSend = {
    joueur: (thisObjectifObject.common ? 0 : $(this).closest('tr').find("#sendto").val()),
    title: thisObjectifObject.title,
    description: thisObjectifObject.description,
    common : thisObjectifObject.common
  };

  socket.emit('new objective', objToSend);

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
};


