var playerID = $(location).attr('pathname').split('/')[3]
var playerData
var tableContent

$(document).ready(function () {
	$("#idPlayer").text(playerID)

	populateTables()
})

function populateTables() {
	$.getJSON('/players/show/'+ playerID, function (data) {
		playerData = data
		if (data.profile)
			populateProfile(data.profile)

		if (data.resources)
			populateResources(data.resources)

		if (data.objectives)
			populateObjectives(data.objectives)

		if (data.objects)
			populateObjects(data.objects)
	})
}

function populateProfile(profile) {
	tableContent = '<tr>'
	tableContent += '<td>'+ profile.name +'</td>'
	tableContent += '<td>'+ profile.maritalStatus +'</td>'
	tableContent += '<td>'+ profile.profession +'</td>'
	tableContent += '<td>'+ profile.description +'</td>'
	tableContent += '</tr>'

	$("#profile table tbody").html(tableContent)
}

function populateResources(resources) {
	tableContent = ''
	$.each(resources, function () {
		tableContent += '<tr>'
		tableContent += '<td>'+ this.name +'</td>'
		tableContent += '<td>'+ this.unit +'</td>'
		tableContent += '<td>'+ this.value +'</td>'
		tableContent += '</tr>'	
	})

	$("#resources table tbody").html(tableContent)
}

function populateObjectives(objectives) {
	tableContent = ''
	$.each(objectives, function () {
		tableContent += '<tr>'
		tableContent += '<td>'+ this.title +'</td>'
		tableContent += '<td>'+ this.description +'</td>'
		tableContent += '<td>'+ this.resource +'</td>'
		tableContent += '<td>'+ this.achieve +'</td>'
		tableContent += '</tr>'	
	})

	$("#objectives table tbody").html(tableContent)
}

function populateObjects(objects) {
	tableContent = ''
	$.each(objects, function () {
		tableContent += '<tr>'
		tableContent += '<td>'+ this.title +'</td>'
		tableContent += '<td>'+ this.description +'</td>'
		tableContent += '<td>'+ this.price +'</td>'
		tableContent += '</tr>'	
	})

	$("#objects table tbody").html(tableContent)
}

