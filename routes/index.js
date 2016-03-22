var express = require('express');
var bcrypt = require('bcrypt');
var salt = process.env.SALT || require('../config/env').salt;
var router = express.Router();

var passport = require('../config/passport');

var User = require('../models/userModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()){
    res.redirect('/login');
  } else {
    res.render('index', { user: JSON.stringify(req.user) });
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
  User.find({ username : req.body.username }, function (user) {
    if (!user) {
      if (req.body.password.length > 5) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          req.body.password = hash;
          var user = new User(req.body);
          user.is_client = true;
          user.save(function (error, user) {
            if (error) {
              req.flash('error', error.message);
              res.redirect('/register');
            }
            user.client = user._id;
            user.save(function (error, user) {
              if (error) {
                req.flash('error', error.message);
                res.redirect('/register');
              }
              passport.authenticate('local')(req, res, function () {
                res.redirect('/');
              });
            });
          });
        });
      } else {
        req.flash('error', 'Password must be at least 6 characters');
        res.redirect('/register');
      }
    } else {
      req.flash('error', 'User already exists');
      res.redirect('/register');
    }
  });
});

module.exports = router;
