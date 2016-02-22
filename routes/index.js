var express = require('express');
var router = express.Router();

var passport = require('../config/passport');

var User = require('../models/index').User;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    user: req.user
  });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/hello',
  failureFlash: true
}));

router.get('/create', function(req, res, next) {
  User.create({'username':'Username', 'password':'Password', 'rol':'rol'})
    .then(function(user) {
      console.log(user);
    });
  var date = new Date();

  res.send(date);
});

module.exports = router;
