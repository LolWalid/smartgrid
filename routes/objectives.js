var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin', function(req, res) {
  res.render('admin/objectives',  {title: 'Smartgrid - Admin', player: 'Admin' });
});

/*
 * GET objectives.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('objectives').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * ADD objectif.
 */
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

/*
 * EDIT objectif.
 */
router.post('/edit', function(req, res) {
    var db = req.db;
    var id = req.body.id;
    db.collection('objectives').updateById(id, {'$set':req.body}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteobjectif.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var objectifToDelete = req.params.id;
    db.collection('objectives').removeById(objectifToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
