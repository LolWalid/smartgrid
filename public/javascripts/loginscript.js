var socket = io.connect('http://localhost:3000');

var players = [];

function addPlayer(id) {
	data = {
		_id: id,
		money: 3000,
		energy: 500,
		satisfaction: 3,
		score: 1350,
	};

	$.ajax({
		url: '/players/add',
		type: 'POST',
		data: data,
		dataType : 'json',
	}).done(function(response){
		if (response.msg === '')
			window.location.href='/';
		else
			console.log(response.msg);

	});
};

function updatePlayers () {
	$.getJSON('/players/list', function (data) {
		players = data;
		addDisconnected();
	});
};

function isConnected(i) {
	var bool = false;
	$.each(players, function() {
		if (this._id === i.toString())
			bool = true;
	});
	return bool;
}

function addDisconnected() {
	var tablecontent = '<option value="0" + >Admin</option>';
	var tableConnected = '';
	for( var i = 1; i <= 10 ; i++) {
		if (!isConnected(i)) {
			tablecontent += '<option value=' + i + '>Joueur ' + i +'</option>';
		}
		else
			tableConnected += '<li>Joueur ' + i + '</li>';
	}
	$('#pseudo').html(tablecontent);
	$(".connected").html(tableConnected);
}


$(document).ready(function(){
	var i;
	updatePlayers();

	var login,password;
	$("#login-form").submit(function(event){
		pseudo = $("#pseudo").val();
		password = $("#password").val();

		if (pseudo == 0 && password === 'smartgrid') {
			event.preventDefault();
			var login = { login : pseudo};
			console.log(login);
			$.ajax({
				url: '/login',
				type: 'POST',
				data: login,
				dataType: 'json',
			}).done(function( response ) {
				if (response.msg === 'done')
					window.location.href='/objectives/admin';
			});
		}
		else if (pseudo != '0') {
			event.preventDefault();
			var login = { login : pseudo};
			//socket.emit('addPlayer', {'room' : 'players'});
			$.ajax({
				url: '/login',
				type: 'POST',
				data: login,
				dataType: 'json',
			}).done(function( response ) {
				if (response.msg === 'done') {
					addPlayer(pseudo);
					//window.location.href='/';
				}
			});
		}
		else {
			alert('Mauvais mot de passe.');
			$("#password").val('');
			event.preventDefault();
		}
	});
});
