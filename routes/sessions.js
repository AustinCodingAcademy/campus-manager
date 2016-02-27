var express = require('express');
var router = express.Router();
var sessionController = require('../controllers/sessionController.js');

/*
* GET
*/
router.get('/', function(req, res) {
  sessionController.list(req, res);
});

/*
* GET
*/
router.get('/:id', function(req, res) {
  sessionController.show(req, res);
});

/*
* POST
*/
router.post('/', function(req, res) {
  sessionController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', function(req, res) {
  sessionController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', function(req, res) {
  sessionController.remove(req, res);
});

module.exports = router;
