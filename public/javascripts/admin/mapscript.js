var players = []
var city = {}

$(document).ready(function() {
  updatePlayers()
  updateCity()
})

function updatePlayers () {
  $.getJSON('/players/connectedlist', function (data) {
    players = data
    updateSideBar()
    updateNavBarMap()
  })
}

function updateCity() {
  $.getJSON('/cities/show/city', function(data){
    city = data
    showObject()
    updateNavBarMap()
  })
}

function getPosition(name){
  var position =  city.objects.map(function(arrayItem) { return arrayItem.title; }).indexOf(name)
  return position;
}

function getValue(name) {
  if (city.resources) {
    var position =  city.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(name)
    if (position > -1)
      return city.resources[position].value + ' ' + city.resources[position].unit;
  }
  else
    return -1
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

function updateNavBarMap() {
  $("#valeur_argent").text(" " + getValue("MoneyShared"))
  $("#nb_joueurs").text(" " + players.length)
}

function updateSideBar(){
  tableContent = ''
  $.each(players,function() {
    tableContent += '<li><div class="joueur">'
    tableContent += '<img width="30px" src="/img/perso/' + this.profile.image + '"/> '
    tableContent += ' ' + (this.profile ? this.profile.name : "No name")
    tableContent += '</div></li>'
    tableContent += '<br/>'
  })

  $("#joueurs").html(tableContent)
}
