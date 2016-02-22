var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt')

var salt = require('./env').salt;
var User = require('../models/index').user;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.find({ where: { username : username } }).then(function(user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      } else {
        bcrypt.hash(user.password, salt, function(err, hash) {
          bcrypt.compare(user.password, hash, function(err, match) {
            if (match) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Incorrect password.' });
            }
          });
        });
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user) {
    done(null, user);
  });
});

module.exports = passport;
