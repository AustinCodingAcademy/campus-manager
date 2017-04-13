var Backbone = require('backbone');
var CourseModel = require('../models/CourseModel');

module.exports = Backbone.Collection.extend({
  url: 'api/courses',
  model: CourseModel,

  comparator: function(x, y) {
    if (!x.get('term') || !y.get('term')) {
      return 0;
    }
    var XstartDate = x.get('term').get('start_date');
    var YstartDate = y.get('term').get('start_date');;
    if (XstartDate === YstartDate) {
      if (x.get('name') === y.get('name')) {
        return 0;
      }
      return x.get('name') > y.get('name') ? 1 : -1;
    }
    return XstartDate > YstartDate ? -1 : 1;
  },

  reverse: function(x, y) {
    var XstartDate = x.get('term').get('start_date');
    var YstartDate = y.get('term').get('start_date');;
    if (XstartDate === YstartDate) {
      if (x.get('name') === y.get('name')) {
        return 0;
      }
      return x.get('name') > y.get('name') ? 1 : -1;
    }
    return XstartDate > YstartDate ? 1 : -1;
  }
});
