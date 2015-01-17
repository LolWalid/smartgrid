var socket = io.connect('http://localhost:3000')

var tableContent

$(document).ready(function () {

	populateTable();

	$("#deleteAll").on('click', deleteAllPlayers);
	
})

function populateTable() {
	$.getJSON('/players/list', function(data) {
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td> Player '+ this._id +'</td>';
			tableContent += '<td>'+ this.money +'</td>';
			tableContent += '<td>'+ this.energy +'</td>';
			tableContent += '<td>'+ this.satisfaction +'</td>';
			tableContent += '<td>'+ this.score +'</td>';
			tableContent += '</tr>';
		})

		$('#connectedPlayers table tbody').html(tableContent);
	})
}

function deleteAllPlayers(event) {
	event.preventDefault();
	$.ajax({
		type: 'POST',
		contentType : 'application/json',
		url: '/players/deleteAll'
	}).done(function(response) {
        alert(response.msg);
        window.location.href='/players/admin';
    });
}