var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

/*
* GET
*/
router.get('/', function(req, res) {
  userController.list(req, res);
});

/*
* GET
*/
router.get('/:id', function(req, res) {
  userController.show(req, res);
});

/*
* POST
*/
router.post('/', function(req, res) {
  userController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', function(req, res) {
  userController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', function(req, res) {
  userController.remove(req, res);
});

/*
* POST
*/
router.post('/import', function(req, res) {
  userController.import(req, res);
});

module.exports = router;
