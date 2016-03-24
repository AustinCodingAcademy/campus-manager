var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt')

var salt = "$2a$10$cWJo9D7mPJXd5u6VXGP0suNVzBobvQrv6IEMTXq9Nf6hy88rETfGC";
var User = require('../models/userModel');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username : username }, function(err, user) {
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
