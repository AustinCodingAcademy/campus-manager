var express = require('express');
var router = express.Router();
var VideosController = require('../controllers/VideosController.js');
var middleware = require('./middleware');

router.post('/', middleware.admin, function(req, res) {
  VideosController.create(req, res);
});

module.exports = router;
