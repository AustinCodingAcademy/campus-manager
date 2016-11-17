var express = require('express');
var router = express.Router();
var LocationController = require('../controllers/LocationController.js');
var middleware = require('./middleware');

/*
* GET
*/
router.get('/', middleware.instructor, function (req, res) {
  LocationController.list(req, res);
});

/*
* GET
*/
router.get('/:id', middleware.instructor, function (req, res) {
  LocationController.show(req, res);
});

/*
* POST
*/
router.post('/', middleware.instructor, function (req, res) {
  LocationController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', middleware.instructor, function (req, res) {
  LocationController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', middleware.instructor, function (req, res) {
  LocationController.remove(req, res);
});

module.exports = router;
