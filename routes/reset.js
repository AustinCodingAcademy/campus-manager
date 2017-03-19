var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var UserModel = require('../models/UserModel');
var nodemailer = require('nodemailer');
const utils = require('../src/js/utils');
var mandrillTransport = require('nodemailer-mandrill-transport');
var transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: process.env.MANDRILL_API_KEY
  }
}));

router.get('/', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('reset', {
      csrfToken: req.csrfToken(),
      register: process.env.REGISTRATION_ENABLED
    });
  }
});

router.post('/', function(req, res, next) {
  UserModel.findOne({ username: req.body.username }, function(err, user) {
    if(err) {
      return res.json(500, {
        message: 'Error getting user.',
        error: err
      });
    }

    if(!user) {
      return res.json(500, {
        message: 'No such user.'
      });
    }

    user.reset_password = Math.random().toString(36).substring(7);
    user.save(function(err, user) {
      const key = utils.campusKey(user);
      transport.sendMail({
        from: `info@${key}codingacademy.com`,
        to: user.username,
        subject: 'Campus Manager Password Reset',
        html: `Visit ${key}codingacademy.com/reset/${user.reset_password} to reset your password.`
      }, function(err, info) {
        if (err) {
          return res.json(500, {
            message: 'Error sending email. Please contact support.'
          });
        } else {
          return res.json(200, {
            message: 'Check your email for the reset link.'
          });
        }
      });
    });
  });
});

router.get('/:reset_password', function(req, res, next) {
  var reset_password = req.params.reset_password;
  res.render('password', {csrfToken: req.csrfToken()});
});

router.put('/:reset_password', function(req, res, next) {
  var reset_password = req.params.reset_password;
  UserModel.findOne({ reset_password: reset_password }, function(err, user) {
    var saltRounds = 10;

    if (!user) {
      req.flash('error', 'Reset token expired.');
      return res.redirect('/login');
    }

    if (req.body.password.length <= 5) {
      req.flash('error', 'Password must be at least 6 characters');
      return res.redirect('/reset/' + reset_password);
    }

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      user.password = hash
      user.reset_password = '';
      user.save(function (err, user) {
        if (err) {
          req.flash('error', error.message);
        }

        return res.redirect('/login');
      });
    });
  });
});

module.exports = router;
