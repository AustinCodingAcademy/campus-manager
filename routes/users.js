var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');
var middleware = require('./middleware');
const UserModel = require('../models/UserModel');
const fetch = require('node-fetch');
const btoa = require('btoa');

router.get('/insightly', middleware.admin, (req, res) => {

  const url = 'https://api.insight.ly/v2.2/Leads/';
  const headers = {
    Authorization: 'Basic ' + btoa(process.env.INSIGHTLY_API_KEY),
    'Accept-Encoding': 'gzip'
  };

  function findLead(users, idx) {
    if (idx === users.length) return;
    const user = users[idx];
    console.log(user.username);
    fetch(`${url}Search?email=${user.username}`, {
      method: 'GET',
      headers
    }).then(leads => {
      return leads.json().then(leads => {
        const lead = leads[0];
        if (lead) {
          user.insightly = lead['LEAD_ID'];
          user.save(user => {
            setTimeout(() => {
              findLead(users, ++idx)
            }, 201);
          })
        } else {
          setTimeout(() => {
            findLead(users, ++idx)
          }, 201);
        }
      });
    });
  }


  UserModel.find({}, (err, users) => {
    findLead(users, 0);
  });
});

/*
* GET
*/
router.get('/', middleware.admin, function(req, res) {
  UserController.list(req, res);
});

/*
* GET
*/
router.get('/:id', middleware.instructorOrMe, function(req, res) {
  UserController.show(req, res);
});

/*
* POST
*/
router.post('/', middleware.admin, function(req, res) {
  UserController.create(req, res);
});

/*
* PUT
*/
router.put('/:id', middleware.instructorOrMe, function(req, res) {
  UserController.update(req, res);
});

/*
* DELETE
*/
router.delete('/:id', middleware.admin, function(req, res) {
  UserController.remove(req, res);
});

/*
* POST
*/
router.post('/import', middleware.admin, function(req, res) {
  UserController.import(req, res);
});

/*
* POST
*/
router.post('/attendance', middleware.auth, function(req, res) {
  UserController.attendance(req, res);
});

module.exports = router;
