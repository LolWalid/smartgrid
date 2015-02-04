var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
  sess = req.session;

  if (sess.joueur)
    res.render('objects', {title: 'Smartgrid - Objects', player: 'Joueur ' + sess.joueur });
  else
    res.render('login', {title: 'Smartgrid - Connexion'});
});

router.get('/admin', function(req, res) {
  res.render('admin/objects', {title: 'Smartgrid - Admin - Objects'});
});


 router.get('/list', function(req, res) {
  var db = req.db;
  db.collection('objects').find().toArray(function (err, items) {
    res.json(items);
  });
});

 router.post('/add', function(req, res) {
  var db = req.db;

  var data = req.body;

  db.collection('objects').insert(data, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
      );
  });
});

 router.post('/edit', function(req, res) {
  var db = req.db;
  var id = req.body.id;
  db.collection('objects').updateById( id, req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
      );
  });
});


 router.delete('/delete/:id', function(req, res) {
  var db = req.db;
  var objectToDelete = req.params.id;
  db.collection('objects').removeById(objectToDelete, function(err, result) {
    res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
  });
});

 router.get('/show/:id',function(req, res){
  var db = req.db
  var objectId = req.params.id;
  db.collection('objects').findById(objectId, function (err, item) {
    if (err)
      console.log(err);
    else
      res.json(item);
  })
})

 module.exports = router;
