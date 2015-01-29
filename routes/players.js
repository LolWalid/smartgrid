var express = require('express');
var router = express.Router();

var sess;

router.get('/data', function (req, res) {
  sess = req.session;
  var db = req.db;
    db.collection('players').findById(sess.joueur, function (err, items) {
    if (err)
      console.log(err);
    else
      res.json(items);
  });
  //res.send(data);
});

router.get('/admin', function (req, res) {
  res.render('admin/players', {title: 'Smartgrid - Admin - Players'});
});

router.get('/list', function (req, res) {
  var db = req.db;
  db.collection('players').find().sort({_id : 1}).toArray(function (err, items) {
    res.json(items);
  });
});

router.post('/add', function(req, res) {
    var db = req.db;

    var data = req.body;
    db.collection('players').insert(data, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

router.get('/show/:id', function(req, res) {
  var db = req.db;
  var playerId = req.params.id;

  db.collection('players').findById(playerId, function (err, items) {
    if (err)
      console.log(err);
    else
      res.json(items);
  });
});


router.post('/edit', function(req, res) {
    var db = req.db
    var id = req.body._id
    db.collection('players').updateById(id, {'$set':req.body}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

router.post('/deleteAll', function(req, res) {
  var db = req.db;
  db.collection('players').remove({}, function(err, result){
    res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
  })
});


router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var playerToDelete = req.params.id;
    db.collection('players').removeById(playerToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
