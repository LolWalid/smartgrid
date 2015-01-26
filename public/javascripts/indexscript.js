var socket = io.connect('/')

$(document).ready(function() {
	$("#budget").on('click', function(event) {
		window.location.href='/budget'
	})

	$("#consommation").on('click', function(event) {
		window.location.href='/objects'
	})
})