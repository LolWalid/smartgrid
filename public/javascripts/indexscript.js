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
			profileContent = '<p><strong>'+ data.profile.name + '</strong></p>';
			profileContent += '<p>'+ data.profile.profession + '</p>';
			profileContent += '<p>'+ data.profile.description + '</p>';
		}

		$("#profileContent").html(profileContent);
	})
}
