var Backbone = require('backbone');
var CourseModel = require('../models/courseModel');

module.exports = Backbone.Collection.extend({
  url: 'api/courses',
  model: CourseModel
});
