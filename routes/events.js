var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin', function(req, res) {
  res.render('admin/events');
});

/*
 * GET events.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('events').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * ADD event.
 */
router.post('/add', function(req, res) {
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
router.post('/edit', function(req, res) {
    var db = req.db;
    var id = req.body.id;
    db.collection('events').updateById( id, req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteevent.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var eventToDelete = req.params.id;
    db.collection('events').removeById(eventToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
