var express = require('express');
var router = express.Router();

var sess;

router.get('/list', function(req, res) {
  var db = req.db;
  db.collection('players').find().toArray(function (err, items) {
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

router.get('/:id', function(req, res) {
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
    var db = req.db;
    var id = req.body.id;
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
