var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin', function(req, res) {
  res.render('admin/resources', {title: 'Smartgrid - Admin - Resources'});
});

/*
 * GET resources.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('resources').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * ADD resource.
 */
router.post('/add', function(req, res) {
    var db = req.db;

    console.log(req.body.length);
    var data = req.body;

    db.collection('resources').insert(data, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * EDIT resource.
 */
router.post('/edit', function(req, res) {
    var db = req.db;
    var id = req.body.id;
    db.collection('resources').updateById( id, req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteresource.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var resourceToDelete = req.params.id;
    db.collection('resources').removeById(resourceToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
