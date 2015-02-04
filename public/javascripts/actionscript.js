$(document).ready(function() {
  $('table tbody').on('click', 'td a.showAction', showAction);
  $('#actionList table tbody').on('click', 'td a.triggerAction', triggerAction);

  document.addEventListener("update", getActions, false);
})


function getActions() {
  tableContent = '';
  if (playerData.actions)
    $.each(playerData.actions, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="showAction" rel="' + this._id + '" title="Show Details">' + this.title + '</a></td>';
      tableContent += '<td>' + this.description  + '</td>';
      tableContent += '<td><a href="#" class="triggerAction" rel="' + this._id + '">Donner</a></td>';
      tableContent += '</tr>';
});
  $('#myactions table tbody').html(tableContent);
}



function showAction () {
  var thisActionId = $(this).prop('rel')

  // Get Index of action based on id value
  var arrayPosition = playerData.actions.map(function(arrayItem) { return arrayItem._id; }).indexOf(thisActionId)

  // Get our Actionif Action
  var thisAction = playerData.actions[arrayPosition]

  tableContent = '<div class="message-heading">'
  tableContent += '<h3 class="message-title">' + thisAction.title + '</h3>'
  tableContent += '</div><div class="message-body">'
  tableContent += '<p>' + thisAction.description + '</p><br />'
  tableContent += "<h4>Effets</h4>"
  tableContent += "<ul>"

  $.each(thisAction.effects, function() {
    tableContent +='<li>' + this.resource + ' : ' + this.effect + ' ' + (this.unit ? this.unit : '') + '</li>'
  })

  tableContent += "</ul>"
  tableContent += '<input type="button" class="ok_obj btn btn-lg btn-success btn-right" value="OK" />'
  tableContent += '</div>'
  //tableContent += '<input type="button" class="linkbuyaction btn btn-lg btn-warning btn-left" value="Acheter" />'

  if ($('.popin').length === 0)
    $('body').append('<div class="message objective popin">' + tableContent + '</div>')
  else
    $('.popin').html(tableContent);

  //$('body input.linkbuyaction').on('click', buyAction);
  $(".ok_obj").click(function() {
    $(this).closest('.message').remove()
  })
}


function triggerAction() {
  action = {
    action : 'proposition',
    action : $(this).prop('rel'),
    joueur : playerData._id,
  }
  socket.emit('action triggered', action)
}
