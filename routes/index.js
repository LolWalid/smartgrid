var express = require('express');
var router = express.Router();

var sess;

/* GET home page. */
router.get('/', function(req, res) {
  sess = req.session;
  if (sess.joueur)
    res.render('index', {title: 'Smartgrid', player: 'Joueur ' + sess.joueur });
  else
  	res.render('login', { title: 'Smartgrid - Connexion'});
});

router.get('/map', function(req, res) {
  res.render('admin/map')
})

router.get('/objectives', function(req, res) {
  sess = req.session;

  if (sess.joueur)
    res.render('objectives', {title: 'Smartgrid', player: 'Joueur ' + sess.joueur });
  else
    res.render('login', {title: 'Smartgrid - Connexion'});
});

router.get('/objects', function(req, res) {
  sess = req.session;

  if (sess.joueur)
    res.render('objects', {title: 'Smartgrid', player: 'Joueur ' + sess.joueur });
  else
    res.render('login', {title: 'Smartgrid - Connexion'});
});

router.get('/budget', function(req,res) {
  sess = req.session;

  if (sess.joueur)
    res.render('budget', {title: 'Smartgrid', player: 'Joueur' + sess.joueur });
  else
    res.render('login', {title: 'Smartgrid - Connexion'});
});

router.post('/login', function(req, res) {
	sess = req.session;

  sess.joueur = req.body.login;
  res.send({msg: 'done'});
});

router.post('/logout', function(req,res) {
  sess = req.session;

  delete sess.joueur;
  res.send({msg: 'done'});
});

module.exports = router;
