var CourseModel = require('../models/CourseModel.js');
const moment = require('moment');

/**
* CourseController.js
*
* @description :: Server-side logic for managing courses.
*/
module.exports = {

  create: function(req, res) {
    var link = req.query.link;
    var meetId = req.query.meetId;
    CourseModel.findOne({ virtual : {$regex : meetId}}, function(err, course) {
      if(err) {
        return res.json(500, {
          message: 'Error getting course.',
          error: err
        });
      }
      if (!course) {
        return res.json(404, {
          message: 'No such course with that meet id'
        });
      }
      course.videos.set(course.videos.length, {
        link: link,
        timestamp: moment().format('YYYY-MM-DD')
      });
      course.save(err => {
        if (err) {
          return res.json(500, {
            message: 'Error saving course video',
            error: err
          });
        }
        return res.json(req.query.link);
      });
    });
  }
}
