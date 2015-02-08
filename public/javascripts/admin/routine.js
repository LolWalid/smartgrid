setInterval(function(){
  $.each(players, function() {
    //checkMoney(this)
  })
}, 10000)

function checkMoney(joueur) {
  player = joueur
  var moneyPosition = player.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf("Money")

  if (moneyPosition > -1 && player.resources[moneyPosition].value < 0) {

    var satisfactionPosition = player.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf("Satisfaction")
    var scorePosition = player.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf("Score")

    if (satisfactionPosition > -1 && player.resources[satisfactionPosition].value > 50)
      player.resources[satisfactionPosition].value -= 50;

    if (scorePosition > -1)
      player.resources[scorePosition].value -= 50;

    $.ajax({
      type: 'POST',
      contentType : 'application/json',
      data: JSON.stringify(player),
      url: '/players/edit'
    }).done(function(response) {
      if (response.msg === '') {
        socket.emit('update view')
      }
      else
        console.log('Error: ' + response.msg)
    })
  }
}
