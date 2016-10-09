var express = require('express');
var router = express.Router();
var ImportController = require('../controllers/ImportController.js');
var middleware = require('./middleware');

/*
* POST
*/
router.post('/registrations', middleware.admin, function(req, res) {
  ImportController.registrations(req, res);
});

module.exports = router;
