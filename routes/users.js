var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');
var middleware = require('./middleware');
var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
var transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: process.env.MANDRILL_API_KEY
  }
}));
var passport = require('passport');

router.get('/current', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info != undefined) {
      console.log(info.message);
      res.send(info.message);
    } else {
      res.status(200).send({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username
      });
    }
  })(req, res, next);
});

/*
* GET
*/
router.get('/', middleware.admin, function(req, res) {
  UserController.list(req, res);
});

/*
* GET
*/
router.get('/:id', middleware.instructorOrMe, function(req, res) {
  UserController.show(req, res);
});

/*
* POST
*/
router.post('/', middleware.admin, function(req, res) {
  UserController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', middleware.instructorOrMe, function(req, res) {
  UserController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', middleware.admin, function(req, res) {
  UserController.remove(req, res);
});

/*
* POST
*/
router.post('/import', middleware.admin, function(req, res) {
  UserController.import(req, res);
});

/*
* POST
*/
router.post('/attendance', middleware.auth, function(req, res) {
  UserController.attendance(req, res);
});

module.exports = router;
