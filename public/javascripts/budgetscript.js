$(document).ready(function () {
	populateTable()
})

function populateTable() {
	$.get('/players/data', function (data) {
		if (data.profile) {
			var playerIncome = data.profile.income
			var playerExpenses = data.profile.expenses
			var totalExpenses = 0;
			$('#salaire').text(playerIncome.salary)
			$('#aidesSociales').text(playerIncome.socialWelfare)
			$('#totalR').text(parseFloat(playerIncome.salary) + parseFloat(playerIncome.socialWelfare))

			$('#loyer').text(playerExpenses.rent)
			$('#alimentation').text(playerExpenses.food)
			$('#transports').text(playerExpenses.transportation)
			$('#education').text(playerExpenses.education)
			$('#restaurants').text(playerExpenses.restaurants)
			$('#habillement').text(playerExpenses.clothing)
			$('#sante').text(playerExpenses.healthcare)
			$('#alcool').text(playerExpenses.alcohol)
			$('#communications').text(playerExpenses.communication)
			$('#autres').text(playerExpenses.other)
			$.each(playerExpenses, function(key, val) {
				totalExpenses += parseFloat(val)
			})
			$('#totalD').text(totalExpenses)
		}
	}).done(function (response) {
			$("#revenus tr td span").each(function() {processPercents($(this), 'totalR')})
			$("#depenses tr td span").each(function() {processPercents($(this), 'totalD')})
	})
}

function processPercents(object, total) {
	var totalVal = parseFloat($("#" + total).text())
	var newVal = parseFloat(object.parent().next().text()) / totalVal * 100
	object.text(newVal.toFixed(1) + " %")
}
