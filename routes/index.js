var express = require('express');
var router = express.Router();

var sess;

/* GET home page. */
router.get('/', function(req, res) {
  sess = req.session;

  if (sess.joueur) {
  	res.render('index', {title: 'Smartgrid', player: 'Joueur ' + sess.joueur });
  }
  else {
  	res.render('login', { title: 'Smartgrid - Connexion'});
  }
});

router.get('/objectives', function(req, res) {
  sess = req.session;

  if (sess.joueur) {
    res.render('objectives', {title: 'Smartgrid', player: 'Joueur ' + sess.joueur });
  }
  else {
    res.render('login', { title: 'Smartgrid - Connexion'});
  }
});

router.post('/login', function(req, res) {
	sess = req.session;

	sess.joueur = req.body.login;
  res.send({ msg: 'done'});
});

module.exports = router;
