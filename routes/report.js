var express = require('express');
var router = express.Router();
var ReportController = require('../controllers/ReportController.js');
var middleware = require('./middleware');
const cors = require('cors');

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (process.env.REPORT_WHITELIST.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

/*
* GET
*/
router.get('/', middleware.admin, function(req, res) {
  ReportController.index(req, res);
});

/*
* GET
*/
router.get('/:query', middleware.admin, cors(corsOptionsDelegate), function(req, res) {
  ReportController.index(req, res);
});

module.exports = router;
