var socket = io.connect('/')

$(document).ready(function() {

	populateProfil();

	$("#budget").on('click', function(event) {
		window.location.href='/budget'
	})

	$("#shop").on('click', function(event) {
		window.location.href='/objects'
	})
	$("#actions").on('click', function(event) {
		window.location.href='/actions'
	})
})

function populateProfil() {
	profileContent = '';

	$.get('/players/data', function (data) {
		if (data.profile) {
			profileContent = '<p><img src="/img/perso/'+ data.profile.image +'" width="80" /> <strong>'+ data.profile.name +'</strong>, ';
			profileContent += '<i>'+ data.profile.profession +'</i></p>';
			profileContent += '<p>'+ data.profile.description +'</p>';
		}

		$("#profileContent").html(profileContent);
	})
}
