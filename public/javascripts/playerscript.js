//var socket = io.connect('http://localhost:3000')
var socket = io.connect('/')

var objectifsListData = []

var playerID;
var playerData;

$(document).ready(function() {
  // Recuperer id joueur
  $.get('/players/data', function (data) {
    playerID = data._id;
    playerData = data;
    console.log("Joueur n°" + playerID);
    if (data.objectives)
      for (var i = 0; i < data.objectives.length; i++) {
        addObj(data.objectives[i])
      }
  })
  //Remplir la liste d'objectifs
  /*  $.get('objectives/list', function (data) {
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].players.indexOf(playerID))
        if (data[i].common == "true"  || data[i].players.indexOf(playerID) != -1){
        var obj =
        {
          'joueur': data[i].common == "true" ? 0 : data[i].players[i],
          'titre': data[i].objectifTitle,
          'description': data[i].description
        }
        addObj(obj)
      }
    }
  })*/


  //Recevoir nouvel ojectif
  socket.on('server_objective_message', function(message) {
    if (message.joueur == 0 || message.joueur == playerID)
      newQuest(message);

  });
  //Recevoir nouvel event
  socket.on('server_event_message', function(message) {
    if (message.joueur == 0 || message.joueur == playerID)
      newEvent(message);

  });
  socket.on('update_view', function(message) {
    console.log(message)
    if (message === 'all') {
      $("#valeur_argent").text(playerData.money);
      $("#valeur_energie").text(playerData.energy);
      $("#valeur_satisfaction").text(playerData.satisfaction);
      $("#valeur_score").text(playerData.score);
    }
  })
});


function newQuest(message) {
  $("#new").append('<h3>Nouvel objectif !</h3>')
  $("#new").append('<p><strong>'+message.titre+'</strong><br />')
  $("#new").append(message.description+'</p><br />')
  $("#new").append('<input type="button" id="ok_obj" value="OK" />')
  $("#new").show()

  $("#ok_obj").click(function() {
    addObj(message)
  })
}

function newEvent(message) {
  $("#new").append('<h3>Nouvel Évènement !</h3>')
  $("#new").append('<p><strong>'+message.titre+'</strong><br />')
  $("#new").append(message.description+'</p><br />')
  $("#new").append('<input type="button" id="ok_event" value="OK" />')
  $("#new").append('<input type="button" id="not_ok_event" value="NOT OK" />')
  $("#new").show()

  $("#ok_event").click(function() {
    updatePlayer(message)
    $('#new').hide()
  })
}


function addObj(message) {
  $("#new").empty().hide()
  newline = '<div id="obj" class="obj1"><strong>'+ message.titre +'</strong> : '+ message.description +'</div>'
  //console.log(message.common);
  if (message.common)
    $("#objectivesCommon").append(newline);
  else
    $("#objectivesIndiv").append(newline);
};

function updatePlayer (message) {
    // If it is, compile all event info into one object
    var playerEdit = playerData

    // $.each(playerEdit.resources, function(){
    //   for (var i = 0; i < message.effects.length; i++) {
    //    if(message.effects[i].resource == this.resource)
    //     this.quantity += message.effects[i].effect
    //   }
    // })

    // Use AJAX to post the object to our editEvent service
    $.ajax({
      type: 'POST',
      data: JSON.stringify(eventEdit),
      contentType : 'application/json',
      url: '/players/edit',
    }).done(function( response ) {
      // Check for successful (blank) response
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
