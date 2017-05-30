const CourseModel = require('../models/CourseModel');
const TrackModel = require('../models/TrackModel.js');

/**
* RegistrationController.js
*
* @description :: Server-side logic for managing grades.
*/
module.exports = {

  /**
  * RegistrationController.create()
  */
  create: function (req, res) {
    function registerUser(courses, idx) {
      idx = idx || 0;
      const course = courses[idx];
      const userIdx = course.registrations.indexOf(req.body.userId);
      if (userIdx === -1) {
        course.registrations.set(course.registrations.length, req.body.userId);
      }
      course.save(err => {
        if (err) {
          return res.json(500, {
            message: 'Error saving registration',
            error: err
          });
        }
        if (idx < courses.length - 1) {
          registerUser(courses, ++idx)
        } else {
          return res.json(req.body.userId);
        }
      })
    }

    function singleCourse() {
      CourseModel.findOne({
        _id: req.body.courseId,
        client: req.user.client
      }, (err, course) => {
        if (err) {
          return res.json(500, {
            message: 'Error finding course.',
            error: err
          });
        }
        if (!course) {
          return res.json(500, {
            message: 'Course not found.',
            error: err
          });
        }
        registerUser([course]);
      });
    }

    if (req.body.track) {
      TrackModel.findOne({ courses: req.body.courseId }).populate('courses').exec()
      .then(track => {
        registerUser(track.courses);
      })
      .catch(error => {
        console.log({
          message: 'Error finding track.',
          error
        });
        singleCourse();
      })
    } else {
      singleCourse();
    }

  },

  /**
  * RegistrationController.remove()
  */
  remove: function (req, res) {
    CourseModel.findOne({
      _id: req.body.courseId,
      client: req.user.client
    }, (err, course) => {
      if (err) {
        return res.json(500, {
          message: 'Error finding course.',
          error: err
        });
      }
      if (!course) {
        return res.json(500, {
          message: 'Course not found.',
          error: err
        });
      }
      const idx = course.registrations.indexOf(req.body.userId);
      if (idx > -1) {
        course.registrations.remove(req.body.userId);
      }
      course.save(err => {
        if (err) {
          return res.json(500, {
            message: 'Error saving registration',
            error: err
          });
        }
        return res.json(req.body.userId);
      })
    });
  }
};
