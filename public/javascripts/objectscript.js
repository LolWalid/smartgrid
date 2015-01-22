objectListData = []

$(document).ready(function() {
  getObjects();
  $('#objectList table tbody').on('click', 'td a.linkshowobject', showObject);
  $('#objectList table tbody').on('click', 'td a.linkbuyobject', buyObject);

})


function getObjects() {
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/objects/list', function( data ) {
    objectListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowobject" rel="' + this._id + '" title="Show Details">' + this.title + '</a></td>';
      tableContent += '<td>' + this.price + " " +this.costResource + '</td>';
      tableContent += '<td><a href="#" class="linkbuyobject" rel="' + this._id + '">Acheter</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#objectList table tbody').html(tableContent);
  });
};


function showObject () {
    // Retrieve objectifname from link rel attribute
    var thisObjectId = $(this).prop('rel')

  // Get Index of object based on id value
  var arrayPosition = objectListData.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisObjectId)

  // Get our Objectif Object
  var thisObject = objectListData[arrayPosition]

  tableContent = '<div class="message-heading">'
  tableContent += '<h3 class="message-title">' + thisObject.title + '</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += thisObject.description + '</p><br />'
  tableContent += "<h4>Effets</h4>"
  tableContent += "<ul>"
  console.log(thisObject.effects)
  $.each(thisObject.effects, function() {
    tableContent +='<li>' + this.resource + ' : ' + this.effect + '</li>'
  })

  tableContent += "</ul>"
  tableContent += '<input type="button" class="ok_obj btn btn-lg btn-success btn-right" value="ok" />'
  tableContent += '<input type="button" class="linkbuyobject btn btn-lg btn-warning btn-left" value="Acheter" />'
  tableContent += '</div>'

  if ($('.popin').length === 0)
    $('body').append('<div class="message objective popin">' + tableContent + '</div>')
  else
    $('.popin').html(tableContent);

  $('body input.linkbuyobject').on('click', buyObject);
  $(".ok_obj").click(function() {
    $(this).closest('.message').remove()
  })


}

function buyObject () {
  console.log("Soon")
}
