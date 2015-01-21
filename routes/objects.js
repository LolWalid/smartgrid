var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin', function(req, res) {
  res.render('admin/objects');
});

/*
 * GET objects.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('objects').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * ADD object.
 */
router.post('/add', function(req, res) {
    var db = req.db;

    console.log(req.body.length);
    var data = req.body;

    db.collection('objects').insert(data, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * EDIT object.
 */
router.post('/edit', function(req, res) {
    var db = req.db;
    var id = req.body.id;
    db.collection('objects').updateById( id, req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteobject.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var objectToDelete = req.params.id;
    db.collection('objects').removeById(objectToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
