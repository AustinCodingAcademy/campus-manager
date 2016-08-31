var _ = require('underscore');

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
    }, null, {
      sort: 'term.start_date'
    }).populate('term registrations').exec(function(err, courses){
      if(err) {
        return res.json(500, {
          message: 'Error getting course.',
          error: err
        });
      }
      return res.json(courses);
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
    }).populate('term registrations').exec(function(err, course){
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
    var course = new CourseModel({
      name : req.body.name,
      term : req.body.term._id,
      days : req.body.days,
      seats : req.body.seats,
      textbook: req.body.textbook,
      videos: req.body.videos,
      cost: req.body.cost
    });
    UserModel.findOne({
      _id: req.user.id
    }).populate('client').exec(function(err, currentUser) {
      course.client = currentUser.client.id;
      course.save(function(err, course){
        if(err) {
          return res.json(500, {
            message: 'Error saving course',
            error: err
          });
        }
        return res.json({
          message: 'saved',
          _id: course._id
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
    }).populate('term registrations').exec(function(err, course){
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

      var attributes = [
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
        'term'
      ];

      _.each(attributes, function(attr) {
        course[attr] =  req.body[attr] ? req.body[attr] : course[attr];
      });

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
        course.populate('registrations').populate(function(err, course) {
          return res.json(course);
        });
      });
    });
  },

  /**
  * CourseController.remove()
  */
  remove: function(req, res) {
    var id = req.params.id;
    CourseModel.remove({
      client: req.user.client,
      _id: id
    }, function(err, course){
      if(err) {
        return res.json(500, {
          message: 'Error getting course.',
          error: err
        });
      }
      return res.json(course);
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
    }).populate('term registrations').exec(function(err, course){
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
        course.populate('registrations').populate(function(err, course) {
          return res.json(course);
        });
      });
    });
  }
};
