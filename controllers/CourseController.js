var _ = require('underscore');
var mongoose = require('mongoose');
var CourseModel = require('../models/CourseModel.js');
var UserModel = require('../models/UserModel.js');

/**
* CourseController.js
*
* @description :: Server-side logic for managing courses.
*/
module.exports = {

  /**
  * CourseController.list()
  */
  list: function(req, res) {
    CourseModel.find({
      client: req.user.client
    }).populate('term registrations location').exec(function(err, courses){
      if(err) {
        return res.json(500, {
          message: 'Error getting course.',
          error: err
        });
      }
      var sorted = courses.sort(function(x, y) {
        var XstartDate = x.term.start_date;
        var YstartDate = y.term.start_date;;
        if (XstartDate === YstartDate) {
          if (x.name === y.name) {
            return 0;
          }
          return x.name > y.name ? 1 : -1;
        }
        return XstartDate > YstartDate ? -1 : 1;
      });

      return res.json(sorted);
    });
  },

  /**
  * CourseController.show()
  */
  show: function(req, res) {
    var id = req.params.id;
    CourseModel.findOne({
      _id: id,
      client: req.user.client
    }).populate('term registrations location').exec(function(err, course){
      if(err) {
        return res.json(500, {
          message: 'Error getting course.',
          error: err
        });
      }
      if(!course) {
        return res.json(404, {
          message: 'No such course'
        });
      }
      return res.json(course);
    });
  },

  /**
  * CourseController.create()
  */
  create: function(req, res) {
    UserModel.findOne({
      _id: req.user.id
    }).populate('client').exec(function(err, currentUser) {
      var course = new CourseModel({
        name : req.body.name,
        term : req.body.term,
        days : req.body.days,
        seats : req.body.seats,
        textbook: req.body.textbook,
        videos: req.body.videos,
        cost: req.body.cost,
        location : req.body.location,
        client: currentUser.client
      });

      course.save(function(err, course) {
        if(err) {
          return res.json(500, {
            message: 'Error saving course',
            error: err
          });
        }
        course.populate('location term').populate(function(err, course) {
          return res.json(200, course);
        });
      });
    });
  },

  /**
  * CourseController.update()
  */
  update: function(req, res) {
    var id = req.params.id;
    CourseModel.findOne({
      _id: id,
      client: req.user.client
    }, function(err, course){
      if(err) {
        return res.json(500, {
          message: 'Error saving course',
          error: err
        });
      }
      if(!course) {
        return res.json(404, {
          message: 'No such course'
        });
      }

      var adminAttributes = [
        'name',
        'session',
        'client',
        'days',
        'seats',
        'holidays',
        'grades',
        'textbook',
        'videos',
        'cost',
        'term',
        'location'
      ];

      var instructorAttributes = [
        'grades',
        'videos'
      ];

      if (req.user.is_admin) {
        _.each(adminAttributes, function(attr) {
          course[attr] = req.body.hasOwnProperty(attr) ? req.body[attr] : course[attr];
        });
      } else {
        _.each(instructorAttributes, function(attr) {
          course[attr] =  req.body.hasOwnProperty(attr) ? req.body[attr] : course[attr];
        });
      }

      if (req.body.registrations) {
        var registrations = _.map(req.body.registrations, '_id');
        if (registrations.length > course.registrations.length) {
          var courseRegistrations = _.map(course.registrations, function(id) {
            return id.toString();
          });
          var newRegistrations = _.difference(registrations, courseRegistrations);
          if (newRegistrations.length) {
            var userId = newRegistrations[0];
            UserModel.findOne({
              _id: userId,
              client: req.user.client
            }, (err, user) => {
              if(err || !user) {
                return res.json(500, {
                  message: 'Error finding user.',
                  error: err
                });
              }
              CourseModel.find({ registrations: mongoose.Types.ObjectId(user._id)}, (err, courses) => {
                if(err) {
                  return res.json(500, {
                    message: 'Error finding courses.',
                    error: err
                  });
                }
                if (courses.length === 0) {
                  user.price = course.cost;
                  user.save(function(err, user) {
                    if(err) {
                      return res.json(500, {
                        message: 'Error saving user.',
                        error: err
                      });
                    }
                    saveCourse();
                  });
                } else {
                  saveCourse();
                }
              });
            });
          }
        } else {
          saveCourse()
        }
      } else {
        saveCourse();
      }

      function saveCourse() {
        course.registrations = req.body.registrations ? _.map(req.body.registrations, '_id') : course.registrations;
        course.save(function(err, course){
          if(err) {
            return res.json(500, {
              message: 'Error getting course.',
              error: err
            });
          }
          if(!course) {
            return res.json(404, {
              message: 'No such course'
            });
          }
          course.populate('registrations location term').populate(function(err, course) {
            return res.json(course);
          });
        });
      }
    });
  },

  /**
  * CourseController.remove()
  */
  remove: function(req, res) {
    var id = req.params.id;
    CourseModel.findOne({
      client: req.user.client,
      _id: id
    }, function(err, course) {
      if(err) {
        return res.json(500, {
          message: 'Error getting course.',
          error: err
        });
      }
      if (!course) {
        return res.json(404, {
          message: 'No such course'
        });
      }
      if (course.registrations.length > 0) {
        return res.json(500, {
          message: "Can't delete a course with registrations"
        });
      }
      return course.remove().exec(() => {
        return res.json(course);
      });
    });
  },

  /**
  * CourseController.screencasts()
  */
  screencasts: function(req, res) {
    _.each(req.body, function(screencast) {
      CourseModel.findOne({ _id: screencast.course_id }, function(err, course) {
        if(err) {
          return res.json(500, {
            message: 'Error finding course',
            error: err
          });
        }
        if (course) {
          if (!course.videos) {
            course.videos = [];
          }
          course.videos.push({
            youtubeId: screencast.youtubeId,
            link: screencast.link,
            timestamp: screencast.timestamp
          });
          course.save();
        }
      });
    });
  return res.json(req.body);
},

  /**
  * CourseController.register()
  */
  register: function(req, res) {
    var id = req.params.id;
    CourseModel.findOne({
      _id: id,
      client: req.user.client
    }).populate('term').exec(function(err, course){
      if(err) {
        return res.json(500, {
          message: 'Error saving course',
          error: err
        });
      }
      if(!course) {
        return res.json(404, {
          message: 'No such course'
        });
      }

      if (req.body.registrations) {
        var registrations = _.map(req.body.registrations, '_id');
        if (registrations.length > course.registrations.length) {
          var courseRegistrations = _.map(course.registrations, function(id) {
            return id.toString();
          });
          var newRegistrations = _.difference(registrations, courseRegistrations);
          if (newRegistrations.length) {
            var userId = newRegistrations[0];
            UserModel.findOne({
              _id: userId,
              client: req.user.client
            }, (err, user) => {
              if(err) {
                return res.json(500, {
                  message: 'Error finding user.',
                  error: err
                });
              }
              CourseModel.find({ registrations: mongoose.Types.ObjectId(user._id)}, (err, courses) => {
                if(err) {
                  return res.json(500, {
                    message: 'Error finding courses.',
                    error: err
                  });
                }
                if (courses.length === 0) {
                  console.log("here");
                  user.price = course.cost;
                  user.save(function(err, user) {
                    if(err) {
                      return res.json(500, {
                        message: 'Error saving user.',
                        error: err
                      });
                    }
                    saveCourse();
                  });
                } else {
                  saveCourse();
                }
              });
            });
          }
        } else {
          saveCourse()
        }
      } else {
        saveCourse();
      }

      function saveCourse() {
        course.registrations = req.body.registrations ? _.map(req.body.registrations, '_id') : course.registrations;
        course.save(function(err, course){
          if(err) {
            return res.json(500, {
              message: 'Error getting course.',
              error: err
            });
          }
          if(!course) {
            return res.json(404, {
              message: 'No such course'
            });
          }
          return res.json(course);
        });
      }
    });
  }
};
