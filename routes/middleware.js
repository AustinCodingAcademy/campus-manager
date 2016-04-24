module.exports = {
  auth: function(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    }

    // if they aren't redirect them to the login page
    res.redirect("/login")
  },

  client: function(req, res, next) {

    if (req.isAuthenticated() && req.user.is_client) {
      return next();
    }

    res.status(401).send({ error: "Must be at least client level." });
  },

  admin: function(req, res, next) {

    if (req.isAuthenticated() && (req.user.is_client || req.user.is_admin)) {
      return next();
    }

    res.status(401).send({ error: "Must be at least admin level." });
  },

  instructor: function(req, res, next) {

    if (req.isAuthenticated() &&
      (req.user.is_client || req.user.is_admin || req.user.is_instructor)) {
      return next();
    }

    res.status(401).send({ error: "Must be at least instructor level." });
  },

  student: function(req, res, next) {

    if (req.isAuthenticated() &&
      (req.user.is_client || req.user.is_admin || req.user.is_instructor || req.user.student)) {
      return next();
    }

    res.status(401).send({ error: "Must be at least student level." });
  }
};
