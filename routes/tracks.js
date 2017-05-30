const express = require('express');
const router = express.Router();
const TrackController = require('../controllers/TrackController');
const middleware = require('./middleware');

/*
* GET
*/
router.get('/', middleware.instructor, (req, res) => {
  TrackController.list(req, res);
});

/*
* GET
*/
router.get('/:id', middleware.admin, (req, res) => {
  TrackController.show(req, res);
});

/*
* POST
*/
router.post('/', middleware.admin, (req, res) => {
  TrackController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', middleware.admin, (req, res) => {
  TrackController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', middleware.admin, (req, res) => {
  TrackController.remove(req, res);
});

module.exports = router;
