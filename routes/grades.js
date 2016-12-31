/**
 * @module routes/grades
 * @description Routes to GradeController.
 */

const express = require('express');
const router = express.Router();
const GradeController = require('../controllers/GradeController');

/**
* POST request to add/update grade
* @param {String} path a string path
* @param {Function} [callback, ...] Optional callbacks that behave like middleware [Express.js `router.METHOD()` methods]{@link https://expressjs.com/en/api.html#router.METHOD}
* @param {Function} callback Final callback
* @memberof {@module routes/grades}
* @function
* @name /
*/
router.post('/', (req, res) => {
  GradeController.create(req, res);
});

module.exports = router;
