/**
 * @module routes/withdrawals
 * @description Routes to WithdrawalController.
 */

const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const WithdrawalController = require('../controllers/WithdrawalController');

/**
* POST request to register a user into a course
* @param {String} path a string path
* @param {Function} [callback, ...] Optional callbacks that behave like middleware [Express.js `router.METHOD()` methods]{@link https://expressjs.com/en/api.html#router.METHOD}
* @param {Function} callback Final callback
* @memberof {@module routes/routes}
* @function
* @name /api/withdrawals
*/
router.post('/', (req, res) => {
  WithdrawalController.create(req, res);
});

/**
* DELETE remove a user withdrawal from a course
* @param {String} path a string path
* @param {Function} [callback, ...] Optional callbacks that behave like middleware [Express.js `router.METHOD()` methods]{@link https://expressjs.com/en/api.html#router.METHOD}
* @param {Function} callback Final callback
* @memberof {@module routes/routes}
* @function
* @name /api/withdrawals
*/
router.delete('/', middleware.admin, (req, res) => {
  WithdrawalController.remove(req, res);
});

module.exports = router;
