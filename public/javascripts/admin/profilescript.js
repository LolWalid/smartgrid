var profileListData = [];

$(document).ready(function() {

	populateTable();

	$('#profilesList table tbody').on('click', 'td a.linkshowprofile', showProfileInfo);

	$('#profilesList table tbody').on('click', 'td a.linkdeleteprofile', deleteProfile);

	$('#displayAddForm').on('click', function () {
		$("#editProfile").slideUp(function() {
			$('#editProfile input').val('');
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

		tableContent += '<tr>';
		tableContent += '<td><a href="#" class="linkshowprofile" rel="'+ this._id +'" title="Show details">'+ this.name +'</a></td>';
		tableContent += '<td>'+ this.maritalStatus +'</td>';
		tableContent += '<td>'+ this.profession +'</td>';
		tableContent += '<td>'+ this.description +'</td>';
		tableContent += '<td><a href="#" class="linkdeleteprofile" rel="'+ this._id +'">Delete</a></td>';
		tableContent += '<td>None</td>';
		tableContent += '</tr>';
	});

	$("#ProfilesList table tbody").html(tableContent);
}

function showProfileInfo(event) {
	event.preventDefault();

	$("#addProfile").slideUp(function() {
		$("#editPofile").slideDown();
	});

	var profileID = $(this).prop('rel');

	var arrayPosition = profileListData.map(function(arrayItem) {return arraItem._id;}).indexOf(profileID);
	var profileObject = profileListData[arrayPosition];

	$("#profileInfoGender").text(profileObject.gender);
	$("#profileInfoName").text(profileObject.name);
	$("#profileInfoMaritalStatus").text(profileObject.maritalStatus);
	$("#profileInfoProfession").text(profileObject.profession);
	$("#profileInfoDescription").text(profileObject.description);
}

function addProfile(event) {
	event.preventDefault();

	var errorCount = 0;
	$('#addProfile').each(function(index,val) {
		if ($(this).val() === '') 
			errorCount++;
	});

	if (errorCount === 0) {
		var newProfile = {
			gender : $("#addProfile input[name=inputProfileGender]:radio").val(),
			name : $("#addProfile #inputProfileName").val(),
			maritalStatus : $("#addProfile input[name=inputProfileMaristalStatus]:radio").val(),
			profession : $("#addProfile #inputProfileProfession").val(),
			income : {
				salary : $("#addProfile #inputProfileSalary").val(),
				socialWelfare : $("#addProfile #inputProfileSocialWelfare").val()
				}
			expenses : {
				rent : $("#addProfile #inputProfileRent").val(),
				energy : $("#addProfile #inputProfileEnergy").val(),
				food : $("#addProfile #inputProfileFood").val(),
				transportation : $("#addProfile #inputProfileTransportation").val(),
				education : $("#addProfile #inputProfileEducation").val(),
				restaurants : $("#addProfile #inputProfileRestaurants").val(),
				clothing : $("#addProfile #inputProfileClothing").val(),
				healthcare : $("#addProfile #inputProfile").val(),
				alcohol : $("#addProfile #inputProfileAlcohol").val(),
				communication : $("#addProfile #inputProfileCommunication").val(),
				other : $("#addProfile #inputProfileOther").val()
			}
			description : $("#addProfile #inputProfileDescription").val(),
		}
	}
	else {
		alert('Please fill in all fields');
		return false;
	}
}

function editPofile(event) {
	event.preventDefault();
}

function deleteProfile(event) {
	event.preventDefault();
}