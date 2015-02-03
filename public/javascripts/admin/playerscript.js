var tableContent

$(document).ready(function () {

	populateTable();

	$("#connectedPlayers table tbody").on('click', 'td a.linkdeleteplayer', deletePlayer);

	$("#connectedPlayers table tbody").on('click', 'td a.linkeditplayer', editPlayer);

	$("#deleteAll").on('click', deleteAllPlayers);

})

function getValue(player, name) {
	var arrayPosition = player.resources.map(function(arrayItem) { return arrayItem.name; }).indexOf(name)
	return player.resources[arrayPosition] ? (player.resources[arrayPosition].value + player.resources[arrayPosition].unit): 'NOT IN DB';
}


function populateTable() {
	$.getJSON('/players/list', function(data) {
		tableContent = ''
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkeditplayer" rel="'+ this._id +'">Player '+ this._id +'</a></td>';
			tableContent += '<td>'+ getValue(this, "Money") +'</td>';
			tableContent += '<td>'+ getValue(this, "Energy") +'</td>';
			tableContent += '<td>'+ getValue(this, "Satisfaction") +'</td>';
			tableContent += '<td>'+ getValue(this, "Score") +'</td>';
			tableContent += '<td><a href="#" class="linkdeleteplayer" rel="'+ this._id +'">Kick</a></td>';
			tableContent += '</tr>';
		})

		$('#connectedPlayers table tbody').html(tableContent);
	})
}

function editPlayer(event) {
	event.preventDefault();

	document.location.href = '/players/editplayer/' + $(this).prop('rel');
}

function deletePlayer(event) {
	event.preventDefault();

	var confirmation = confirm('Are you sure you want to delete this player ?');

	if (confirmation) {
		var id = $(this).prop('rel');
		$.ajax({
			type: 'DELETE',
			contentType: 'application/json',
			url: '/players/delete/' + id
		}).done(function(response) {
			socket.emit('delete player', {'player': id});
			window.location.href='/players/admin';
		});
	}
	else {
		return false;
	}
}

function deleteAllPlayers(event) {
	event.preventDefault();

	var confirmation = confirm('Are you sure you want to delete ALL players ?');

	if (confirmation){
		$.ajax({
			type: 'POST',
			contentType: 'application/json',
			url: '/players/deleteAll'
		}).done(function(response) {
			alert(response.msg);
			window.location.href='/players/admin';
		});
	}
	else {
		return false;
	}
}
