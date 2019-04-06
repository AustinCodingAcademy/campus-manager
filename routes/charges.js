var express = require('express');
var router = express.Router();
var ChargeController = require('../controllers/ChargeController.js');
var middleware = require('./middleware');

/*
* POST
*/

router.post('/plaid/:token', middleware.auth, function(req, res) {
  ChargeController.plaid(req, res);
});

router.post('/:token', middleware.auth, function(req, res) {
  ChargeController.charge(req, res);
});

module.exports = router;
