// Objectlist data array for filling in info box
var objectListData = [];

// DOM Ready =============================================================
$(document).ready(function() {
  // Populate the object table on initial page load
  populateTable();

  // Add ShowObjectInfo click
  $('#objectList table tbody').on('click', 'td a.linkshowobject', showObjectInfo);

  $('#objectList table tbody').on('click', 'td a.linkdeleteobject', deleteObject);

  $('#displayAddForm').on('click', function () {
    $("#editObject").slideUp(function() {
      $('#editObject input').val('');
      $("#addObject").slideToggle();
    });
  });

  // Add Object button click
  $('#btnAddObject').on('click', addObject);

  // Edit Object button click
  $('#btnEditObject').on('click', editObject);

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
  $.getJSON( '/objects/list', function( data ) {
    objectListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowobject" rel="' + this._id + '" title="Show Details">' + this.title + '</a></td>';
      tableContent += '<td>' + this.description + '</td>';
      tableContent += '<td>' + (this.common ? "Common" : "Individual") + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteobject" rel="' + this._id + '">Delete</a></td>';
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

  $("#addObject").slideUp(function () {
    $("#editObject").slideDown();
  });

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

    var isCommon = $('#addObject input#inputObjectCommon').is(":checked")

    // If it is, compile all object info into one object
    var newObject = {
      title : $('#addObject input#inputObjectTitle').val(),
      description : $('#addObject textarea#objectDescription').val(),
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
        $('#addObject input').val('');

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

    var isCommon = $('#addObject input#inputObjectCommon').is(":checked")

    // If it is, compile all object info into one object
    var objectEdit = {
      id : $('#editObject input#editObjectId').val(),
      title: $('#editObject input#editObjectTitle').val(),
      description: $('#editObject input#editObjectDescription').val(),
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
        $('#editObject input').val('');

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
  $(this).parents('.add_input_effects').append('<div class="form-group">\
    <label class="col-sm-2 control-label">Bonus/Malus</label>\
    <div class="col-sm-5">\
    <select class="resource form-control"></select>\
    </div>\
    <div class="col-sm-4">\
    <input type="text" class="effect form-control" placeholder="Other effect of the object">\
    </div>\
    <div class="col-sm-1">\
    <button class="remove_field btn btn-danger"><span>-</span></button>\
    </div>\
    </div>');
  $('.remove_field').last().on('click', removeField);
  //updateResources();
}

function removeField(e) {
  e.preventDefault();
  $(this).parents('div.form-group').remove();
}

