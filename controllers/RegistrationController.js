const CourseModel = require('../models/CourseModel');
const TrackModel = require('../models/TrackModel');
const UserModel = require('../models/UserModel');
const moment = require('moment');
const utils = require('../src/js/utils');
const nodemailer = require('nodemailer');
const mandrillTransport = require('nodemailer-mandrill-transport');
const transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: process.env.MANDRILL_API_KEY
  }
}));

/**
* RegistrationController.js
*
* @description :: Server-side logic for managing grades.
*/
module.exports = {

  /**
  * RegistrationController.create()
  */
  create: async function (req, res) {
    try {
      const registerUser = async (courses, idx) => {
        idx = idx || 0;
        const course = courses[idx];
        const user = await UserModel.findOne({
          _id: req.body.userId,
          client: req.user.client
        })
        if (!user.price) user.price = course.cost;
        await user.save();
        const userIdx = course.registrations.indexOf(req.body.userId);
        if (userIdx === -1) {
          course.registrations.set(course.registrations.length, req.body.userId);
        }
        await course.save();
        if (idx < courses.length - 1) {
          return registerUser(courses, ++idx)
        } else {
          let key = utils.campusKey(user);
          try {
            await transport.sendMail({
              from: `info@${key}codingacademy.com`,
              to: user.username,
              subject: `${key.charAt(0).toUpperCase() + key.slice(1)} Coding Academy course payment successful!`,
              html: `Your payment has been processed!
              Visit https://campus.${key}codingacademy.com/, scroll down, and click on your class to view your course materials.`
            })
          } catch (error) {
            console.error(error)
          }
          return res.json(req.body.userId);
        }
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
        TrackModel.findOne({
          courses: req.body.courseId
        }).populate({
          path: 'courses', populate: [{ path: 'term' }]
        }).exec()
        .then(track => {
          const courses = track.courses.filter(course => {
            return moment(course.term.start_date).isSameOrAfter(moment(), 'day');
          });
          registerUser(courses);
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
    } catch(err) {
      return res.status(500).send('error registering student in course');
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
