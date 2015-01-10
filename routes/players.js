var express = require('express');
var router = express.Router();

var sess;

router.get('/id', function (req, res) {
	sess = req.session;

	res.send({ id: sess.joueur});
});

module.exports = router;