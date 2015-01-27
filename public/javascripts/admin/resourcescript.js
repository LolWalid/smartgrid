var ressourceList = [];


ready = $(function() {

  populateTable();

  $('#resourceList table tbody').on('click', 'td a.linkdeleteresource', deleteResource);

  $('#btnAddResource').on('click', addResource);

  $('#displayAddForm').on('click', function () {
    $("#newResource").slideToggle();
  });

  // Edit Objectif button click
  //$('#btnEditObjectif').on('click', editObjectif);

});

$(document).ready(ready);


function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/resources/list', function( data ) {
    objectifListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td>' + this.name + '</td>';
      tableContent += '<td>' + this.unit + '</td>';
      tableContent += '<td>' + this.defaultValue + '</td>';
      tableContent += '<td>' + (this.shared ? 'Yes' : 'No') + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteresource" rel="' + this._id + '">Delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#resourceList table tbody').html(tableContent);
  });
};

function addResource(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#newResource input').not("#inputResourceUnit").each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check and make sure errorCount's still at zero
  if(errorCount === 0) {

    // If it is, compile all objectif info into one object
    var newObjectif = {
      name : $('#newResource input#inputResourceName').val(),
      shared : $('#newResource input#inputResourceShared').is(":checked"),
      defaultValue : parseInt($('#newResource input#inputResourceValue').val()),
      unit : $('#newResource input#inputResourceUnit').val()
    }
//    newObjectif.effects = effectsJson;

    // Use AJAX to post the object to our addobjectif service
    $.ajax({
      type: 'POST',
      contentType : 'application/json',
      data: JSON.stringify(newObjectif),
      url: '/resources/add'
    }).done(function( response ) {

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#newResource input').not(":checkbox").val('');
        $('#newResource textarea').val('');

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

function deleteResource(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this resource ?');

  // Check and make sure the objectif confirmed
  if (confirmation === true) {

    // If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/resources/delete/' + $(this).prop('rel')
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
