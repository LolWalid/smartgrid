var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin', function(req, res) {
  res.render('admin/decisions');
});

/*
 * GET decisions.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('decisions').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * ADD decision.
 */
router.post('/add', function(req, res) {
    var db = req.db;

    var data = req.body;

    db.collection('decisions').insert(data, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * EDIT decision.
 */
router.post('/edit', function(req, res) {
    var db = req.db;
    var id = req.body.id;
    db.collection('decisions').updateById( id, req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deletedecision.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var decisionToDelete = req.params.id;
    db.collection('decisions').removeById(decisionToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
