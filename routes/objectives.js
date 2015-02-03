var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  sess = req.session;

  if (sess.joueur)
    res.render('objectives', {title: 'Smartgrid', player: 'Joueur ' + sess.joueur });
  else
    res.render('login', {title: 'Smartgrid - Connexion'});
});


router.get('/admin', function(req, res) {
  res.render('admin/objectives',  {title: 'Smartgrid - Admin'});
});

router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('objectives').find().toArray(function(err, items) {
        res.json(items);
    });
});

router.post('/add', function(req, res) {
    var db = req.db;

    console.log(req.body.length);
    var data = req.body;

    db.collection('objectives').insert(data, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

router.post('/edit', function(req, res) {
    var db = req.db;
    var id = req.body.id;
    db.collection('objectives').updateById(id, {'$set':req.body}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var objectifToDelete = req.params.id;
    db.collection('objectives').removeById(objectifToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
