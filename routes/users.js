var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var middleware = require('./middleware');

/*
* GET
*/
router.get('/', middleware.admin, function(req, res) {
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
router.post('/', middleware.admin, function(req, res) {
  userController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', middleware.admin, function(req, res) {
  userController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', middleware.admin, function(req, res) {
  userController.remove(req, res);
});

/*
* POST
*/
router.post('/import', middleware.admin, function(req, res) {
  userController.import(req, res);
});

/*
* POST
*/
router.post('/attendance', middleware.admin, function(req, res) {
  userController.attendance(req, res);
});

module.exports = router;
