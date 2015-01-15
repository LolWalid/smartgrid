var socket = io.connect('http://localhost:3000');


function addPlayer(id) {
	data = {
		sessionId: id,
		money: 3000,
		energy: 500,
		satisfaction: 3,
		score: 1350
	};

	$.ajax({
		url: '/player/add',
		type: 'POST',
		data: data,
		dataType: 'json',
	}).done(function(response){
		if (response.msg != '') {
			console.log("Fail add");
		}
	});
};


$(document).ready(function(){
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
			socket.emit('addPlayer', {'room' : 'players'});
			$.ajax({
				url: '/login',
				type: 'POST',
				data: login,
				dataType: 'json',
			}).done(function( response ) {
				if (response.msg === 'done') {
					addPlayer(pseudo);
					window.location.href='/';
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
