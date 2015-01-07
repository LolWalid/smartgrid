$(document).ready(function(){
	var login,password;
	$("#login-form").submit(function(event){
		pseudo = $("#pseudo").val();
		password = $("#password").val();

		if (pseudo == 0 && password === 'smartgrid') {
			event.preventDefault();
			window.location.href='/objectives/admin';
		}
		else if (pseudo != '0') {
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
					window.location.href='/';
			});
		}
		else {
			alert('Mauvais mot de passe.');
			$("#password").val('');
			event.preventDefault();
		}
	});
});
