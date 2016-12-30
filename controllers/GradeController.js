const UserModel = require('../models/UserModel');

/**
* GradeController.js
*
* @description :: Server-side logic for managing grades.
*/
module.exports = {

  /**
  * GradeController.create()
  */
  create: function (req, res) {
    UserModel.findOne({
      _id: req.body.userId,
      client: req.user.client
    }, (err, user) => {
      if (err) {
        return res.json(500, {
          message: 'Error finding user.',
          error: err
        });
      }
      if (!user) {
        return res.json(500, {
          message: 'User not found.',
          error: err
        });
      }
      let gradeIdx;
      const grade = user.grades.find((grade, idx) => {
        gradeIdx = idx;
        return grade.courseId === req.body.courseId && grade.name === req.body.name;
      });
      if (!grade) {
        gradeIdx = user.grades.length;
      }
      user.grades.set(gradeIdx, {
        score: req.body.score,
        name: req.body.name,
        courseId: req.body.courseId
      });
      user.save(err => {
        if (err) {
          return res.json(500, {
            message: 'Error saving grade',
            error: err
          });
        }
        return res.json(user.grades[gradeIdx]);
      });
    });
  }
};
