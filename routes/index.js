const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const passport = require('../config/passport');
const UserModel = require('../models/UserModel');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const FormData = require('form-data');
const utils = require('../src/js/utils');
var nodemailer = require('nodemailer');
const Hashids = require('hashids');
const hashids = new Hashids(Date.now());
var transport = nodemailer.createTransport({
  service: 'Mandrill',
  auth: {
    user: process.env.MANDRILL_API_USER,
    pass: process.env.MANDRILL_API_KEY
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()){
    res.redirect('/login');
  } else {
    res.render('index', {
      user: JSON.stringify(req.user),
      env: process.env.NODE_ENV,
      csrfToken: req.csrfToken()
    });
  }
});

router.get('/login', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login', {
      csrfToken: req.csrfToken(),
      register: process.env.REGISTRATION_ENABLED
    });
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

router.get('/feedback', function(req, res, next) {
  var user = {
    name: '',
    phone: '',
    username: ''
  };
  if (req.user) {
    user.name = req.user.first_name + ' ' + req.user.last_name;
    user.phone = req.user.phone || '';
    user.username = req.user.username;
  }
  res.render('feedback-iframe', {
    user: user,
    form_url: 'https://docs.google.com/forms/d/e/' + process.env.FEEDBACK_FORM_ID + '/formResponse'
  });
});

router.get('/register', function(req, res, next) {
  if (!process.env.REGISTRATION_ENABLED) { return res.redirect('/'); }
  if(req.isAuthenticated()) {
    return res.redirect('/');
  } else {
    return res.render('register', {
      csrfToken: req.csrfToken(),
      register: process.env.REGISTRATION_ENABLED,
      id: ''
    });
  }
});

// Todo: We should probably look at extracting this into a module
router.post('/register', function(req, res, next) {
  if (!process.env.REGISTRATION_ENABLED) { return res.redirect('/'); }
  UserModel.findOne({ username : req.body.username.toLowerCase() }, function (err, user) {
    var saltRounds = 10;

    if (user) {
      req.flash('error', 'The email address has already been used');
      return res.redirect('/register');
    }

    if (req.body.phone.length < 10) {
      req.flash('error', 'Please enter your phone number.')
      return res.redirect('/register');
    }

    if (req.body.password.length <= 5) {
      req.flash('error', 'Password must be at least 6 characters');
      return res.redirect('/register');
    }

    if (!req.body.first_name) {
      req.flash('error', 'Please enter your first name.')
      return res.redirect('/register');
    }

    if (!req.body.last_name) {
      req.flash('error', 'Please enter your last name.')
      return res.redirect('/register');
    }

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      UserModel.find({}, 'idn', { limit: 1, sort: { idn: -1 } }, function(err, users) {
        var newUser = new UserModel({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          username: req.body.username.toLowerCase(),
          phone: req.body.phone,
          password: hash,
          is_client: true,
          is_admin: true,
          idn: users.length ? users[0].idn + 1 : 1
        });

        newUser.save(function (err, user) {

          if (err) {
            req.flash('error', err.message);
            res.redirect('/register');
          }

          user.client = user._id;
          user.save(function (err, user) {

            if (err) {
              req.flash('error', err.message);
              res.redirect('/register');
            }

            // If the users has been created successfully, log them in with
            // passport to start their session and redirect to the home route
            req.login(user, function(err) {
              if (err) { return res.redirect('/register'); }
              return res.redirect('/');
            });
          });
        });
      });
    });
  });
});

router.get('/register/:id', function(req, res, next) {
  if(req.isAuthenticated()) {
    res.redirect('/');
  } else {
    UserModel.findOne({ _id: req.params.id }, function(err, user) {
      if (err || !user) {
        return res.redirect('/');
      }
      return res.render('register', {
        id: req.params.id,
        csrfToken: req.csrfToken(),
        register: true
      });
    });
  }
});

router.post('/register/:id', function(req, res, next) {

  UserModel.findOne({ username : req.body.username.toLowerCase() }, function (err, user) {
    var saltRounds = 10;

    if (user) {
      req.flash('error', 'The email address has already been used');
      return res.redirect('/register/' + req.params.id);
    }

    if (req.body.password.length <= 5) {
      req.flash('error', 'Password must be at least 6 characters');
      return res.redirect('/register/' + req.params.id);
    }

    if (!req.body.first_name) {
      req.flash('error', 'Please enter your first name.')
      return res.redirect('/register/' + req.params.id);
    }

    if (!req.body.last_name) {
      req.flash('error', 'Please enter your last name.')
      return res.redirect('/register/' + req.params.id);
    }

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      UserModel.find({}, 'idn', { limit: 1, sort: { idn: -1 } }, function(err, users) {
        if (err) {
          req.flash('error', err.message);
          return res.redirect('/register/' + req.params.id);
        }

        console.log(Object.assign({}, req.body, { password: 'hidden' }));

        var newUser = new UserModel({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          phone: req.body.phone,
          username: req.body.username.toLowerCase(),
          password: hash,
          is_student: true,
          client: req.params.id,
          idn: users[0].idn + 1
        });

        newUser.save(function (err, user) {
          if (err) {
            req.flash('error', err.message);
            return res.redirect('/register/' + req.params.id);
          }
          req.login(user, function(err) {
            if (err) { return res.redirect('/register/' + req.params.id); }
            return res.redirect('/');
          });
        });
      });
    });
  });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

router.get('/.well-known/acme-challenge/:content', function(req, res) {
  res.send(process.env.LETS_ENCRYPT_KEY)
});

module.exports = router;
