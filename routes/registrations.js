var express = require('express');
var router = express.Router();
var registrationController = require('../controllers/registrationController.js');

/*
* GET
*/
router.get('/', function(req, res) {
  registrationController.list(req, res);
});


/*
* POST
*/
router.post('/', function(req, res) {
  registrationController.create(req, res);
});

/*
* DELETE
*/
router.delete('/:id', function(req, res) {
  registrationController.remove(req, res);
});

module.exports = router;
