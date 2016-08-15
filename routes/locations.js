var express = require('express');
var router = express.Router();
var LocationController = require('../controllers/LocationController.js');

/*
* GET
*/
router.get('/', function (req, res) {
  LocationController.list(req, res);
});

/*
* GET
*/
router.get('/:id', function (req, res) {
  LocationController.show(req, res);
});

/*
* POST
*/
router.post('/', function (req, res) {
  LocationController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', function (req, res) {
  LocationController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', function (req, res) {
  LocationController.remove(req, res);
});

module.exports = router;
