var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var User = require('../models/index').User;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.find({ where: { username : username } }).then(function(user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password != password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
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
