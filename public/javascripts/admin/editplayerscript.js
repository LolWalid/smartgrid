var playerID = $(location).attr('pathname').split('/')[3]
var playerData
var tableContent

$(document).ready(function () {
	$("#idPlayer").text(playerID)

	populateTables()

	$("#objects table tbody").on('click', 'td a.deleteobject', deleteObject);
	$("#actions table tbody").on('click', 'td a.deleteaction', deleteAction);
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

		if (data.actions)
			populateActions(data.actions)
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
	var effects = ''
	$.each(objects, function (index) {
		$.each(this.effects, function () {
			effects += this.effect +' on '+ this.resource +'<br />'
		})	
		tableContent += '<tr>'
		tableContent += '<td>'+ this.title +'</td>'
		tableContent += '<td>'+ this.description +'</td>'
		tableContent += '<td>'+ this.price +'</td>'
		tableContent += '<td>'+ effects + '</td>'
		tableContent += '<td><a href="#" class="deleteobject" rel="'+ index +'">Delete</a></td>'
		tableContent += '</tr>'	
	})

	$("#objects table tbody").html(tableContent)
}

function populateActions(actions) {
	tableContent = ''
	var effects = ''
	$.each(actions, function (index) {
		$.each(this.effects, function () {
			effects += this.effect +' on '+ this.resource +'<br />'
		})	
		tableContent += '<tr>'
		tableContent += '<td>'+ this.title +'</td>'
		tableContent += '<td>'+ this.description +'</td>'
		tableContent += '<td>'+ effects +'</td>'
		tableContent += '<td><a href="#" class="deleteaction" rel="'+ index +'">Delete</a></td>'
		tableContent += '</tr>'	
	})

	$("#actions table tbody").html(tableContent)
}

function deleteObject(event) {
	event.preventDefault();

	var objectID = $(this).prop('rel')
	var objects = playerData.objects
	var resources = playerData.resources

	var confirmation = confirm('Are you sure you want to delete this object from the player\'s inventory ?')

	if (confirmation === true) {
		var price = objects[objectID].price
		resources[0].value += price

		var effects = objects[objectID].resources

		objects = $.grep(objects, function (value) {
			return value != objects[objectID]
		})

		var playerEdit = {
			_id : playerID,
			resources : resources,
			objects : objects
		}

		$.ajax({
			type: 'POST',
			data: JSON.stringify(playerEdit),
			contentType: 'application/json',
			url: '/players/edit'
		}).done(function (response) {
			if (response.msg !== '') {
				console.log('Error: ' + response.msg)
			}
			else {
				document.location.reload()
			}
		})
	}
	else {
		return false
	}
}

function deleteAction(event) {
	event.preventDefault();

	var actionID = $(this).prop('rel')
	var actions = playerData.actions

	var confirmation = confirm('Are you sure you want to delete this action from the player\'s inventory ?')

	if (confirmation === true) {
		actions = $.grep(actions, function (value) {
			return value != actions[actionID]
		})

		var playerEdit = {
			_id : playerID,
			actions : actions 
		}

		$.ajax({
			type: 'POST',
			data: JSON.stringify(playerEdit),
			contentType: 'application/json',
			url: '/players/edit'
		}).done(function (response) {
			if (response.msg !== '') {
				console.log('Error: ' + response.msg)
			}
			else {
				document.location.reload()
			}
		})
	}
	else {
		return false
	}
}