var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var passport = require('../config/passport');
var UserModel = require('../models/UserModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()){
    res.redirect('/login');
  } else {
    res.render('index', {
      user: JSON.stringify(req.user),
      env: process.env.NODE_ENV
    });
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

// router.get('/register', function(req, res, next) {
//   if(req.isAuthenticated()) {
//     res.redirect('/');
//   } else {
//     res.render('register');
//   }
// });
//
// // Todo: We should probably look at extracting this into a module
// router.post('/register', function(req, res, next) {
//   UserModel.findOne({ username : req.body.username.toLowerCase() }, function (err, user) {
//     var saltRounds = 10;
//
//     if (user) {
//       req.flash('error', 'The email address has already been used');
//       return res.redirect('/register');
//     }
//
//     if (req.body.password.length <= 5) {
//       req.flash('error', 'Password must be at least 6 characters');
//       return res.redirect('/register');
//     }
//
//     bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//
//       user = new UserModel({
//         username: req.body.username.toLowerCase(),
//         password: hash
//       });
//       user.is_client = true;
//
//       user.save(function (error, user) {
//
//         if (error) {
//           req.flash('error', error.message);
//           res.redirect('/register');
//         }
//
//         user.client = user._id;
//         user.save(function (error, user) {
//
//           if (error) {
//             req.flash('error', error.message);
//             res.redirect('/register');
//           }
//
//           // If the users has been created successfully, log them in with
//           // passport to start their session and redirect to the home route
//           req.login(user, function(err) {
//             if (err) { return res.redirect('/register'); }
//             return res.redirect('/');
//           });
//         });
//       });
//     });
//   });
// });

module.exports = router;
