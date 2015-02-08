var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res) {
  sess = req.session;
  if (sess.joueur) {
    if (sess.joueur == 0)
      res.render('admin/players', {title: 'Smartgrid - Admin - Players'});
    else
      res.render('index', {title: 'Smartgrid', player: 'Joueur ' + sess.joueur });
  }
  else
  	res.render('login', { title: 'Smartgrid - Connexion'});
});

router.get('/img/perso', function(req,res) {
  fs.readdir('./public/img/perso/', function(err, files){
    if (!err)
      res.json(files);
  });
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
