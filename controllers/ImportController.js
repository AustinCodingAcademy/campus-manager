var _ = require('underscore');
var UserModel = require('../models/UserModel');
var CourseModel = require('../models/CourseModel.js');

/**
* ImportController.js
*
* @description :: Various import endpoints.
*/
module.exports = {


  registrations: function(req, res) {
    var idx = 0;
    function registerUser(reqUser) {
      UserModel.findOne({ username: reqUser['username'].toLowerCase() }, function(err, user) {
        if(err) {
          return res.json(500, {
            message: 'Error finding user',
            error: err
          });
        }
        if (user) {
          CourseModel.findOne({'_id': reqUser['course_id']}, function(err, course) {
            if(err) {
              return res.json(500, {
                message: 'Error finding course',
                error: err
              });
            }

            if(!_.contains(course.registrations, user._id)) {
              course.registrations.push(user._id);
              course.save();
            }

            if (req.body[++idx]) {
              registerUser(req.body[idx]);
            } else {
              return res.json(200, req.body);
            }
          });
        } else {
          if (req.body[++idx]) {
            registerUser(req.body[idx]);
          } else {
            return res.json(200, req.body);
          }
        }
      });
    }
    if (req.body.length > 1) {
      return registerUser(req.body[idx]);
    } else {
      return res.json(200, req.body);
    }
  }
};
