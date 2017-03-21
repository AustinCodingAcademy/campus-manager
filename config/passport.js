var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var OAuth2Strategy = require('passport-google-oauth').OAuth2Strategy;
var bcrypt = require('bcrypt');
var User = require('../models/UserModel');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username : username.toLowerCase() }, function(err, user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      bcrypt.compare(password, user.password, function(err, match) {
        if (!match) {
          return done(null, false, { message: 'Incorrect password.' });
        }

        return done(null, user);
      });

    });
  }
));

passport.use(new OAuth2Strategy(
  {
    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    callbackURL: `/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOne({ username: profile.emails[0].value }, function (err, user) {
      return cb(err, user);
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(function(user) {
    done(null, user);
  });
});

module.exports = passport;
