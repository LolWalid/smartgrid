var express = require('express');
var router = express.Router();

router.get('/list', function (req, res) {
  var db = req.db;
  db.collection('logs').find().sort({_id : 1}).toArray(function (err, items) {
    res.json(items);
  });
});

router.post('/deleteAll', function(req, res) {
  var db = req.db;
  db.collection('logs').remove({}, function(err, result){
    res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
  })
});


router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var idToDelete = req.params.id;
    db.collection('logs').removeById(idToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
