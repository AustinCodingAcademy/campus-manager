const CourseModel = require('../models/CourseModel');

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
      if (idx === -1) {
        course.registrations.set(course.registrations.length, req.body.userId);
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
