const express = require('express');
const router = express.Router();
const middleware = require('./middleware');
const QueryModel = require('../models/QueryModel');
const cors = require('cors');

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (process.env.REPORT_WHITELIST.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true, methods: 'GET, POST' } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }

  callback(null, corsOptions) // callback expects two parameters: error and options
}

router.get('/:client', cors(corsOptionsDelegate), (req, res) => {
  QueryModel.find({
    client: req.params.client
  })
  .then(queries => {
    res.json(queries);
  })
  .catch(error => {
    console.log(error);
    res.status(500).send(error);
  })
});

router.options('/:client', cors(corsOptionsDelegate)) // enable pre-flight request for DELETE request

router.post('/:client', cors(corsOptionsDelegate), (req, res) => {
  const query = new QueryModel({
    data: req.body.data,
    client: req.params.client
  });
  query.save()
  .then(query => {
    res.json(query)
  })
  .catch(error => {
    res.status(500).send(error);
  })
});

module.exports = router;
