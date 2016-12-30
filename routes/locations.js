const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/LocationController');
const middleware = require('./middleware');

/*
* GET
*/
router.get('/', middleware.instructor, (req, res) => {
  LocationController.list(req, res);
});

/*
* GET
*/
router.get('/:id', middleware.admin, (req, res) => {
  LocationController.show(req, res);
});

/*
* POST
*/
router.post('/', middleware.admin, (req, res) => {
  LocationController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', middleware.admin, (req, res) => {
  LocationController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', middleware.admin, (req, res) => {
  LocationController.remove(req, res);
});

module.exports = router;
