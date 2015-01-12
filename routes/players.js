var express = require('express');
var router = express.Router();

var sess;

router.get('/data', function (req, res) {
	sess = req.session;

	var data = {
		id: sess.joueur,
		money: 3000,
		energy: 500,
		satisfaction: 3,
		score: 1350
	}
	res.send(data);
});

module.exports = router;