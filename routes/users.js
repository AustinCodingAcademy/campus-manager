var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');

/*
* GET
*/
router.get('/', function(req, res) {
  UserController.list(req, res);
});

/*
* GET
*/
router.get('/:id', function(req, res) {
  UserController.show(req, res);
});

/*
* POST
*/
router.post('/', function(req, res) {
  UserController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', function(req, res) {
  UserController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', function(req, res) {
  UserController.remove(req, res);
});

/*
* POST
*/
router.post('/import', function(req, res) {
  UserController.import(req, res);
});

/*
* POST
*/
router.post('/attendance', function(req, res) {
  UserController.attendance(req, res);
});

module.exports = router;
