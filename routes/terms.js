var express = require('express');
var router = express.Router();
var termController = require('../controllers/termController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    termController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    termController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    termController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    termController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    termController.remove(req, res);
});

module.exports = router;