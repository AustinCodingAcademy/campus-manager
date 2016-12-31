/**
 * @module routes/registrations
 * @description Routes to RegistrationController.
 */

const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const RegistrationController = require('../controllers/RegistrationController');

/**
* POST request to register a user into a course
* @param {String} path a string path
* @param {Function} [callback, ...] Optional callbacks that behave like middleware [Express.js `router.METHOD()` methods]{@link https://expressjs.com/en/api.html#router.METHOD}
* @param {Function} callback Final callback
* @memberof {@module routes/routes}
* @function
* @name /api/registrations
*/
router.post('/', (req, res) => {
  RegistrationController.create(req, res);
});

/**
* DELETE remove a user registration from a course
* @param {String} path a string path
* @param {Function} [callback, ...] Optional callbacks that behave like middleware [Express.js `router.METHOD()` methods]{@link https://expressjs.com/en/api.html#router.METHOD}
* @param {Function} callback Final callback
* @memberof {@module routes/routes}
* @function
* @name /api/registrations
*/
router.delete('/', middleware.admin, (req, res) => {
  RegistrationController.remove(req, res);
});

module.exports = router;
