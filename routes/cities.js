var express = require('express');
var router = express.Router();

router.get('/',function(req, res) {
  sess= req.session
  if (sess.joueur) {
      res.render('admin/map', {title: 'Smartgrid - Admin - Map'})
  }
  else
    res.render('login', { title: 'Smartgrid - Connexion'});
})

router.post('/edit', function(req, res) {
  var db = req.db;
  var name = req.body.name;
  db.collection('cities').update({name: name}, {'$set':req.body}, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
      );
  });
});

router.get('/show/:name', function(req, res) {
  var db = req.db;
  var name = req.body.name;
  db.collection('cities').find().toArray(function (err, items) {
    res.json(items[0])
  });
});

router.delete('/delete', function(req, res) {
  var db = req.db;
  var name = req.params.name;
  db.collection('cities').remove({name: name}, function(err, result) {
    res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
  });
});

module.exports = router;
