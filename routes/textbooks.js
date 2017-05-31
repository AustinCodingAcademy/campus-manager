const express = require('express');
const router = express.Router();
const TextbookController = require('../controllers/TextbookController');
const middleware = require('./middleware');

/*
* GET
*/
router.post('/redirect/:id', middleware.auth, (req, res) => {
  TextbookController.redirect(req, res);
});

/*
* GET
*/
router.get('/', middleware.instructor, (req, res) => {
  TextbookController.list(req, res);
});

/*
* GET
*/
router.get('/:id', middleware.admin, (req, res) => {
  TextbookController.show(req, res);
});

/*
* POST
*/
router.post('/', middleware.admin, (req, res) => {
  TextbookController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', middleware.admin, (req, res) => {
  TextbookController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', middleware.admin, (req, res) => {
  TextbookController.remove(req, res);
});

module.exports = router;
