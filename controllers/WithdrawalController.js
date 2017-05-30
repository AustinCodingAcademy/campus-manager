const CourseModel = require('../models/CourseModel');

/**
* WithdrawalController.js
*
* @description :: Server-side logic for managing grades.
*/
module.exports = {

  /**
  * WithdrawalController.create()
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
          message: 'course not found.',
          error: err
        });
      }
      const withdrawal = course.withdrawals.find(withdrawal => { return req.body.userId === withdrawal.userId });
      if (!withdrawal) {
        course.withdrawals.set(course.withdrawals.length, {
          userId: req.body.userId,
          timestamp: Date.now()
        });
      }
      course.save(err => {
        if (err) {
          return res.json(500, {
            message: 'Error saving withdrawal',
            error: err
          });
        }
        return res.json(200, req.body.userId);
      })
    });
  },

  update: (req, res) => {
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
          message: 'course not found.',
          error: err
        });
      }
      const withdrawal = course.withdrawals.find(withdrawal => { return req.body.userId === withdrawal.userId });
      if (withdrawal) {
        course.withdrawals.set(course.withdrawals.indexOf(withdrawal), {
          timestamp: req.body.timestamp,
          userId: req.body.userId
        });
      }
      course.save(err => {
        if (err) {
          return res.json(500, {
            message: 'Error saving withdrawal',
            error: err
          });
        }
        return res.json(200, req.body.userId);
      })
    });
  },

  /**
  * WithdrawalController.remove()
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
      const withdrawal = course.withdrawals.find(withdrawal => { return req.body.userId === withdrawal.userId });
      if (withdrawal) {
        course.withdrawals.remove(withdrawal);
      }
      course.save(err => {
        if (err) {
          return res.json(500, {
            message: 'Error saving withdrawal',
            error: err
          });
        }
        return res.json(req.body.userId);
      })
    });
  }
};
