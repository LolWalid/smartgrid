var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;



/* GET home page. */
router.get('/', function(req, res) {
  res.render('events');
});

/*
 * GET events.
 */
router.get('/eventslist', function(req, res) {
    var db = req.db;
    db.collection('events').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * ADD event.
 */
router.post('/addevent', function(req, res) {
    var db = req.db;

    console.log(req.body.length);
    var data = req.body;

    db.collection('events').insert(data, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * EDIT event.
 */
router.post('/editevent', function(req, res) {
    var db = req.db;
    var id = new ObjectID(req.body.id);
    db.collection('events').update( {_id: id}, req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteevent.
 */
router.delete('/deleteevent/:id', function(req, res) {
    var db = req.db;
    var eventToDelete = req.params.id;
    db.collection('events').removeById(eventToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;