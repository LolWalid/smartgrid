var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;



/* GET home page. */
router.get('/', function(req, res) {
  res.render('objectives');
});

/*
 * GET objectives.
 */
router.get('/objectiveslist', function(req, res) {
    var db = req.db;
    db.collection('objectives').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * ADD objectif.
 */
router.post('/addobjectif', function(req, res) {
    var db = req.db;
    db.collection('objectives').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * EDIT objectif.
 */
router.post('/editobjectif', function(req, res) {
    var db = req.db;
    var id = new ObjectID(req.body.id);
    db.collection('objectives').update( {_id: id}, req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteobjectif.
 */
router.delete('/deleteobjectif/:id', function(req, res) {
    var db = req.db;
    var objectifToDelete = req.params.id;
    db.collection('objectives').removeById(objectifToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
