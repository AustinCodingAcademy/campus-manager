var express = require('express');
var router = express.Router();
var ReportController = require('../controllers/ReportController.js');
var middleware = require('./middleware');

/*
* GET
*/
router.get('/', middleware.admin, function(req, res) {
  ReportController.index(req, res);
});

module.exports = router;
