var express = require('express');
var router = express.Router();
var courseController = require('../controllers/courseController.js');

/*
* GET
*/
router.get('/', function(req, res) {
  courseController.list(req, res);
});

/*
* GET
*/
router.get('/:id', function(req, res) {
  courseController.show(req, res);
});

/*
* POST
*/
router.post('/', function(req, res) {
  courseController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', function(req, res) {
  courseController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', function(req, res) {
  courseController.remove(req, res);
});

module.exports = router;
