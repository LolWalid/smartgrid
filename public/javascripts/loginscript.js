var socket = io.connect('/');

var players = [];

function getResource(object) {
	$.getJSON( '/resources/list', function( data ) {
		$.each(data, function() {
			if (object.resources)
				object.resources.push({name : this.name, unit : this.unit, value : this.defaultValue})
			else
				object.resources = [{name : this.name, unit : this.unit, value : this.defaultValue}]
		})
	})
}

function addPlayer(id) {
	data = {
		_id: id,
		resources : []
	}

	$.getJSON( '/resources/list', function( resourceList ) {
		$.each(resourceList, function() {
			data.resources.push({name : this.name, unit : this.unit, value : (this.defaultValue ? this.defaultValue : 0)})
		})
		$.ajax({
			url: '/players/add',
			type: 'POST',
			data: JSON.stringify(data),
			contentType : 'application/json',
		}).done(function(response){
			if (response.msg === '')
				window.location.href='/';
			else
				console.log(response.msg);
		});
	})
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
	var tableContent = '<option value="0" + >Admin</option>';
	var tableConnected = '';
	for( var i = 1; i <= 10 ; i++) {
		if (!isConnected(i)) {
			tableContent += '<option value=' + i + '>Joueur ' + i +'</option>';
		}
		else
			tableConnected += '<li>Joueur ' + i + '</li>';
	}
	$('#pseudo').html(tableContent);
	$(".connected").html(tableConnected);
}


$(document).ready(function(){
	var i;
	updatePlayers();

	$("#pseudo").change(function () {
		if ($(this).val() != 0) {
			$("#password").hide();
		}
		else {
			$("#password").show();
		}
	});

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
			socket.emit('add player', {'player': pseudo});
			$.ajax({
				url: '/login',
				type: 'POST',
				data: login,
				dataType: 'json',
			}).done(function( response ) {
				if (response.msg === 'done') {
					addPlayer(pseudo);
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
