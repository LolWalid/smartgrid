objectListData = []

$(document).ready(function() {
  getObjects();
  $('#objectList table tbody').on('click', 'td a.linkshowobject', showObject);
  $('#objectList table tbody').on('click', 'td a.linkbuyobject', buyObject);

  $('#myobjects table tbody').on('click', 'td a.linksellobject', sellObject);
  $('#myobjects table tbody').on('click', 'td a.linkrentobject', rentObject);
  $('#myobjects table tbody').on('click', 'td a.linkgiveobject', giveObject);

  $( "#tabs" ).tabs();

  document.addEventListener("update", setMyObjects, false);
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
      tableContent += '<td>' + this.price + " " + (this.costUnit ? this.costUnit : this.costResource) + '</td>';
      tableContent += '<td><a href="#" class="linkbuyobject" rel="' + this._id + '">Acheter</a></td>';
      //tableContent += '<td><a href="#" class="linkrentobject" rel="' + this._id + '">Louer</a></td>';
      //tableContent += '<td><a href="#" class="linkgiveobject" rel="' + this._id + '">Donner</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#objectList table tbody').html(tableContent);
  });
};


function setMyObjects() {
  tableContent = '';
  if (playerData.objects)
    $.each(playerData.objects, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowobject" rel="' + this._id + '" title="Show Details">' + this.title + '</a></td>';
      tableContent += '<td>' + 0.5 * this.price + " " + (this.costUnit ? this.costUnit : this.costResource) + '</td>';
      tableContent += '<td><a href="#" class="linksellobject" rel="' + this._id + '">Vendre</a></td>';
      tableContent += '<td><a href="#" class="linkrentobject" rel="' + this._id + '">Louer</a></td>';
      tableContent += '<td><a href="#" class="linkgiveobject" rel="' + this._id + '">Donner</a></td>';
      tableContent += '</tr>';
    });
  $('#myobjects table tbody').html(tableContent);
}



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
    tableContent +='<li>' + this.resource + ' : ' + this.effect + ' ' + (this.unit ? this.unit : '') + '</li>'
  })

  tableContent += "</ul>"
  tableContent += '<input type="button" class="ok_obj btn btn-lg btn-success btn-right" value="ok" />'
  //tableContent += '<input type="button" class="linkbuyobject btn btn-lg btn-warning btn-left" value="Acheter" />'

  if ($('.popin').length === 0)
    $('body').append('<div class="message objective popin">' + tableContent + '</div>')
  else
    $('.popin').html(tableContent);

  //$('body input.linkbuyobject').on('click', buyObject);
  $(".ok_obj").click(function() {
    $(this).closest('.message').remove()
  })
}

function buyObject () {
  object = {
    action : 'buy',
    object : $(this).prop('rel'),
    joueur : playerData._id
  }
  socket.emit("action on object", object)
}

function sellObject () {
  object = {
    action : 'sell',
    object : $(this).prop('rel'),
    joueur : playerData._id
  }
  socket.emit("action on object", object)
}

function rentObject () {
  object = {
    object : $(this).prop('rel'),
    joueur : playerData._id
  }
  console.log("rentObject")
}

function giveObject () {
    object = {
    object : $(this).prop('rel'),
    joueur : playerData._id
  }
  console.log("giveObject")
}

