var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/index').user;

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.findAll().then(function(users) {
    res.json(users);
  });
});

router.post('/', function(req, res, next) {
  
});

module.exports = router;
