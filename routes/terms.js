var express = require('express');
var router = express.Router();
var TermController = require('../controllers/TermController.js');
var middleware = require('./middleware');

/*
* GET
*/
router.get('/', middleware.admin, function(req, res) {
  TermController.list(req, res);
});

/*
* GET
*/
router.get('/:id', middleware.admin, function(req, res) {
  TermController.show(req, res);
});

/*
* POST
*/
router.post('/', middleware.admin, function(req, res) {
  TermController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', middleware.admin, function(req, res) {
  TermController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', middleware.admin, function(req, res) {
  TermController.remove(req, res);
});

module.exports = router;
