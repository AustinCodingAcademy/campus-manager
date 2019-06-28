const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const UserModel = require('../models/UserModel');

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info != undefined) {
      console.log(info.message);
      res.send(info.message);
    } else {
      req.logIn(user, err => {
        UserModel.findOne({username: user.username}).then(user => {
          console.log(user)
          const token = jwt.sign({ id: user.username }, process.env.SECRET);
          res.status(200).send({ token });
        });
      });
    }
  })(req, res, next);
});

module.exports = router;