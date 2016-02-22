var express = require('express');
var bcrypt = require('bcrypt');
var salt = require('../config/env').salt;
var router = express.Router();

var passport = require('../config/passport');

var User = require('../models/index').user;

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()){
    res.redirect('/login');
  } else {
    res.render('index', { user: req.user });
  }
});

router.get('/login', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login');
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/register', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('register');
  }
});

router.post('/register', function(req, res, next) {
  console.log(req.body.username);
  User.find({ where: { username : req.body.username } }).then(function (user) {
    if (!user) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        req.body.password = hash;
        User.create(req.body).then(function (user) {
          passport.authenticate('local')(req, res, function () {
            res.redirect('/');
          });
        });
      });
    } else {
      req.flash('error', 'User already exists');
      res.redirect('/');
    }
  });
});

module.exports = router;
