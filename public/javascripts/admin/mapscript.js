var players = []
var city

function updatePlayers () {
  $.getJSON('/players/list', function (data) {
    players = data
  })
}

function updateCity() {
  $.getJSON('/cities/show/city', function(data){
    city = data
    showObject()
  })
}


$(document).ready(function() {
  updatePlayers()
  updateCity()
})


function getPosition(name){
  var position =  city.objects(function(arrayItem) { return arrayItem.title; }).indexOf(name)
  return position;

}

function showObject() {
  if (city.objects) {
    if (getPosition("Champs d'éolienne") >= 0 ) {
      add("eolienne", 0, 390, 275, "/img/aap/eolienne2.png", 2);
      add("eolienne", 0, 350, 175, "/img/aap/eolienne.png", 2);
      add("eolienne", 0, 290, 75, "/img/aap/eolienne2.png", 2);
      add("eolienne", 0, 230, -25, "/img/aap/eolienne.png", 1);
      add("eolienne", 0, 170, -155, "/img/aap/eolienne2.png", 3);
    }

    if (getPosition("Bus") >= 0 ) {
      add("bus","", 12, 114, "/img/vehicules/bus_cote.png", 2);
      play();
    }
  }
}
