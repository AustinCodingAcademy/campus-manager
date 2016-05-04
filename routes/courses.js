var express = require('express');
var router = express.Router();
var CourseController = require('../controllers/CourseController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    CourseController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    CourseController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    CourseController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    CourseController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    CourseController.remove(req, res);
});

module.exports = router;