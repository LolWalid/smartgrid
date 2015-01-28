var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/admin', function(req, res) {
  res.render('admin/profiles',  {title: 'Smartgrid - Admin'});
});

/*
 * GET profiles.
 */
router.get('/list', function(req, res) {
    var db = req.db;
    db.collection('profiles').find().toArray(function(err, items) {
        res.json(items);
    });
});

/*
 * ADD profile.
 */
router.post('/add', function(req, res) {
    var db = req.db;

    console.log(req.body.length);
    var data = req.body;

    db.collection('profiles').insert(data, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * EDIT profile.
 */
router.post('/edit', function(req, res) {
    var db = req.db;
    var id = req.body.id;
    db.collection('profiles').updateById(id, {'$set':req.body}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE profile.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var profileToDelete = req.params.id;
    db.collection('profiles').removeById(profileToDelete, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
