var profileListData = [];

$(document).ready(function() {

	populateTable();

	$('#profilesList table tbody').on('click', 'td a.linkshowprofile', showProfileInfo);

	$('#profilesList table tbody').on('click', 'td a.linkdeleteprofile', deleteProfile);

	$('#profilesList table tbody').on('click', 'td a.sendprofile', sendProfile);

	$('#displayAddForm').on('click', function () {
		$("#editProfile").slideUp(function() {
			$('#editProfile input').not(':radio').val('');
			$("#addProfile").slideToggle();
		});
	});

	$("#btnAddProfile").on('click', addProfile);

	$("#btnEditProfile").on('click', editProfile);
});

function populateTable() {
	var tableContent = '';

	$.getJSON('/profiles/list', function(data) {
		profileListData = data;

		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowprofile" rel="'+ this._id +'" title="Show details">'+ this.name +'</a></td>';
			tableContent += '<td>'+ this.maritalStatus +'</td>';
			tableContent += '<td>'+ this.profession +'</td>';
			tableContent += '<td>'+ this.description +'</td>';
			tableContent += '<td><a href="#" class="linkdeleteprofile" rel="'+ this._id +'">Delete</a></td>';
			tableContent += '<td><select id="sendto" class="form-control">';
			$.each(players, function(){
				tableContent += '<option value="'+ this._id +'">Player '+ this._id +'</option>';
			});
			tableContent += '</select></td>';
			tableContent += '<td><a href="#" class="sendprofile" rel="'+ this._id +'">Send</a></td>';
			tableContent += '</tr>';

			$("#profilesList table tbody").html(tableContent);
		});
	});
}

function showProfileInfo(event) {
	event.preventDefault();

	$("#addProfile").slideUp(function() {
		$("#editProfile").slideDown();
	});

	var profileID = $(this).prop('rel');

	var arrayPosition = profileListData.map(function(arrayItem) {return arrayItem._id;}).indexOf(profileID);
	var profileObject = profileListData[arrayPosition];

	$("#profileInfoGender").text(profileObject.gender);
	$("#profileInfoName").text(profileObject.name);
	$("#profileInfoMaritalStatus").text(profileObject.maritalStatus);
	$("#profileInfoProfession").text(profileObject.profession);
	$("#profileInfoDescription").text(profileObject.description);

	$("#profileInfoIncome").text('');
	$("#profileInfoIncome").append('Salary : ' + profileObject.income.salary);
	$("#profileInfoIncome").append('<br /> Social Welfare : ' + profileObject.income.socialWelfare);

	$("#profileInfoExpenses").text('');
	$("#profileInfoExpenses").append('Rent : ' + profileObject.expenses.rent);
	$("#profileInfoExpenses").append('<br /> Energy : ' + profileObject.expenses.energy);
	$("#profileInfoExpenses").append('<br /> Food : ' + profileObject.expenses.food);
	$("#profileInfoExpenses").append('<br /> Transportation : ' + profileObject.expenses.transportation);
	$("#profileInfoExpenses").append('<br /> Education : ' + profileObject.expenses.education);
	$("#profileInfoExpenses").append('<br /> Restaurants : ' + profileObject.expenses.restaurants);
	$("#profileInfoExpenses").append('<br /> Clothing : ' + profileObject.expenses.clothing);
	$("#profileInfoExpenses").append('<br /> Healthcare : ' + profileObject.expenses.healthcare);
	$("#profileInfoExpenses").append('<br /> Alcohol : ' + profileObject.expenses.alcohol);
	$("#profileInfoExpenses").append('<br /> Communication : ' + profileObject.expenses.communication);
	$("#profileInfoExpenses").append('<br /> Other : ' + profileObject.expenses.other);

	$("#editProfileId").val(profileObject._id);
	$("input[name=editProfileGender][value=" + profileObject.gender + "] ").prop('checked', true);
	$("#editProfileName").val(profileObject.name);
	$("input[name=editProfileMaritalStatus][value=" + profileObject.maritalStatus + "]").prop('checked', true);
	$("#editProfileProfession").val(profileObject.profession);
	$("#editProfileDescription").val(profileObject.description);
	$("#editProfile #editProfileSalary").val(profileObject.income.salary);
	$("#editProfile #editProfileSocialWelfare").val(profileObject.income.socialWelfare);
	$("#editProfile #editProfileRent").val(profileObject.expenses.rent);
	$("#editProfile #editProfileEnergy").val(profileObject.expenses.energy);
	$("#editProfile #editProfileFood").val(profileObject.expenses.food);
	$("#editProfile #editProfileTransportation").val(profileObject.expenses.transportation);
	$("#editProfile #editProfileEducation").val(profileObject.expenses.education);
	$("#editProfile #editProfileRestaurants").val(profileObject.expenses.restaurants);
	$("#editProfile #editProfileClothing").val(profileObject.expenses.clothing);
	$("#editProfile #editProfileHealthcare").val(profileObject.expenses.healthcare);
	$("#editProfile #editProfileAlcohol").val(profileObject.expenses.alcohol);
	$("#editProfile #editProfileCommunication").val(profileObject.expenses.communication);
	$("#editProfile #editProfileOther").val(profileObject.expenses.other);
}

function addProfile(event) {
	event.preventDefault();

	var errorCount = 0;
	$('#addProfile input').each(function(index,val) {
		if ($(this).val() === '') 
			errorCount++;
	});

	if (errorCount === 0) {
		var newProfile = {
			gender : $("#addProfile input[name=inputProfileGender]:checked").val(),
			name : $("#addProfile #inputProfileName").val(),
			maritalStatus : $("#addProfile input[name=inputProfileMaritalStatus]:checked").val(),
			profession : $("#addProfile #inputProfileProfession").val(),
			income : {
				salary : $("#addProfile #inputProfileSalary").val(),
				socialWelfare : $("#addProfile #inputProfileSocialWelfare").val()
			},
			expenses : {
				rent : $("#addProfile #inputProfileRent").val(),
				energy : $("#addProfile #inputProfileEnergy").val(),
				food : $("#addProfile #inputProfileFood").val(),
				transportation : $("#addProfile #inputProfileTransportation").val(),
				education : $("#addProfile #inputProfileEducation").val(),
				restaurants : $("#addProfile #inputProfileRestaurants").val(),
				clothing : $("#addProfile #inputProfileClothing").val(),
				healthcare : $("#addProfile #inputProfileHealthcare").val(),
				alcohol : $("#addProfile #inputProfileAlcohol").val(),
				communication : $("#addProfile #inputProfileCommunication").val(),
				other : $("#addProfile #inputProfileOther").val()
			},
			description : $("#addProfile #inputProfileDescription").val()
		}

		$.ajax({
			type: 'POST',
			contentType : 'application/json',
			data: JSON.stringify(newProfile),
			url: '/profiles/add'
		}).done(function( response ) {
			if (response.msg === '') {
				$('#addProfile input').not(':radio').val('');
				$('#addProfile textarea').val('');
				populateTable();
			}
			else {
				alert('Error: ' + response.msg);
			}
		});
	}
	else {
		alert('Please fill in all fields');
		return false;
	}
}

function editProfile(event) {
	event.preventDefault();

	var errorCount = 0;
	$('#editProfile input').each(function(index,val) {
		if ($(this).val() === '') 
			errorCount++;
	});

	if (errorCount === 0) {
		var profile = {
			id : $("#editProfile #editProfileId").val(),
			gender : $("#editProfile input[name=editProfileGender]:checked").val(),
			name : $("#editProfile #editProfileName").val(),
			maritalStatus : $("#editProfile input[name=editProfileMaritalStatus]:checked").val(),
			profession : $("#editProfile #editProfileProfession").val(),
			income : {
				salary : $("#editProfile #editProfileSalary").val(),
				socialWelfare : $("#editProfile #editProfileSocialWelfare").val()
			},
			expenses : {
				rent : $("#editProfile #editProfileRent").val(),
				energy : $("#editProfile #editProfileEnergy").val(),
				food : $("#editProfile #editProfileFood").val(),
				transportation : $("#editProfile #editProfileTransportation").val(),
				education : $("#editProfile #editProfileEducation").val(),
				restaurants : $("#editProfile #editProfileRestaurants").val(),
				clothing : $("#editProfile #editProfileClothing").val(),
				healthcare : $("#editProfile #editProfileHealthcare").val(),
				alcohol : $("#editProfile #editProfileAlcohol").val(),
				communication : $("#editProfile #editProfileCommunication").val(),
				other : $("#editProfile #editProfileOther").val()
			},
			description : $("#editProfile #editProfileDescription").val()
		}

		console.log(profile);

		$.ajax({
			type: 'POST',
			data: profile,
			url: '/profiles/edit',
			contentType : 'application/json',
			data: JSON.stringify(profile),
		}).done(function(response) {
			if (response.msg === '') {
				$('#editProfile input').not(':radio').val('');
				$('#editProfile textarea').val('');

				populateTable();
			}
			else {
				console.log('Error: ' + response.msg);
			}
		});
	}
	else {
		alert('Please fill in all fields');
		return false;
	}
}

function deleteProfile(event) {
	event.preventDefault();

	var confirmation = confirm('Are you sure you want to delete this profile ?');

	if (confirmation === true) {
		$.ajax({
			type: 'DELETE',
			url: '/profiles/delete/' + $(this).prop('rel')
		}).done(function( response ) {
			if (response.msg === '') {
			}
			else {
				alert('Error: ' + response.msg);
			}
			populateTable();
		});
	}
	else {
		return false;
	}
}

function sendProfile(event) {
	event.preventDefault();
	var profileID = $(this).prop('rel');
	var arrayPosition = profileListData.map(function(arrayItem) {return arrayItem._id;}).indexOf(profileID);
	var profileObject = profileListData[arrayPosition];

	var playerID = $(this).closest('tr').find("#sendto").val();

	var profileToSend = {
		profile : profileObject,
		joueur : playerID 
	}

	console.log(profileToSend);

	socket.emit('new profile', profileToSend);
}