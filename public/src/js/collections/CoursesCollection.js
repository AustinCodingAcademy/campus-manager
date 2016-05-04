var Backbone = require('backbone');
var CourseModel = require('../models/CourseModel');

module.exports = Backbone.Collection.extend({
  url: 'api/courses',
  model: CourseModel
});
