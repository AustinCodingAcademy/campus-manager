module.exports = {
  auth: function(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    }

    res.status(401).send({ error: "You are not logged in." });
  },

  client: function(req, res, next) {
    if (req.isAuthenticated() && req.user.is_client) {
      return next();
    }

    res.status(403).send({ error: "Must be at least client level." });
  },

  admin: function(req, res, next) {
    if (req.isAuthenticated() && (req.user.is_client || req.user.is_admin)) {
      return next();
    } else if (req.query.key) {
      var UserModel = require('../models/UserModel');
      console.log(req.query.key);
      UserModel.findOne({ api_key: req.query.key }, function(err, user) {
        if (err) {
          return res.status(500).send({ error: err });
        }
        console.log(user);
        if (user && (user.is_admin || user.is_client)) {
          req.user = user;
          return next();
        }
        return res.status(401).send({ error: "Not a valid API key" });
      })
    } else {
      return res.status(403).send({ error: "Must be at least admin level." });
    }
  },

  me: function(req, res, next) {
    if (req.isAuthenticated() && (req.user.is_client || req.user.is_admin || req.params.id == req.user._id )) {
      return next();
    }

    res.status(403).send({ error: "Not authorized." });
  },

  instructor: function(req, res, next) {
    if (req.isAuthenticated() &&
      (req.user.is_client || req.user.is_admin || req.user.is_instructor)) {
      return next();
    }

    res.status(403).send({ error: "Must be at least instructor level." });
  },

  student: function(req, res, next) {
    if (req.isAuthenticated() &&
      (req.user.is_client || req.user.is_admin || req.user.is_instructor || req.user.student)) {
      return next();
    }

    res.status(403).send({ error: "Must be at least student level." });
  },

  instructorOrMe: function(req, res, next) {
    if (req.isAuthenticated() &&
      (req.user.is_client || req.user.is_admin || req.user.is_instructor || req.params.id == req.user._id)) {
        return next();
    }
    res.status(403).send({ error: "Not authorized." });
  }
};
