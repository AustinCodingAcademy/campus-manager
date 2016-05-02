var express = require('express');
var router = express.Router();
var TermController = require('../controllers/TermController.js');

/*
 * GET
 */
router.get('/', function(req, res) {
    TermController.list(req, res);
});

/*
 * GET
 */
router.get('/:id', function(req, res) {
    TermController.show(req, res);
});

/*
 * POST
 */
router.post('/', function(req, res) {
    TermController.create(req, res);
});

/*
 * PUT
 */
router.put('/:id', function(req, res) {
    TermController.update(req, res);
});

/*
 * DELETE
 */
router.delete('/:id', function(req, res) {
    TermController.remove(req, res);
});

module.exports = router;