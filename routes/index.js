var express = require('express');
var router = express.Router();

var sess;

setSession = function(req){
  sess = req.session;
}

/* GET home page. */
router.get('/', function(req, res) {
  setSession(req);
  if (sess.joueur) {
  	res.render('index', {title: 'Smartgrid', player: 'Joueur ' + sess.joueur });
  }
  else {
  	res.render('login', { title: 'Smartgrid - Connexion'});
  }
});

router.get('/map', function(req, res) {
  res.render('admin/map')
})

router.get('/objectives', function(req, res) {
  setSession(req);

  if (sess.joueur) {
    res.render('objectives', {title: 'Smartgrid', player: 'Joueur ' + sess.joueur });
  }
  else {
    res.render('login', { title: 'Smartgrid - Connexion'});
  }
});

router.post('/login', function(req, res) {
	setSession(req);

	sess.joueur = req.body.login;
  res.send({ msg: 'done'});
});

router.get('/logout', function(req, res) {
  setSession(req);

  delete sess.joueur;
  res.send('Vous êtes maintenant déconnecté.');
});

module.exports = router;
