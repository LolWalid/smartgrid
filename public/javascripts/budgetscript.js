$(document).ready(function () {
	
	$("#revenus tr td span").each(function() {processPercents($(this), 'totalR')})
	$("#depenses tr td span").each(function() {processPercents($(this), 'totalD')})
})

function processPercents(object, total) {
	var totalVal = parseFloat($("#" + total).text())
	var newVal = parseFloat(object.parent().next().text()) / totalVal * 100
	object.text(newVal.toFixed(1) + " %")
}
