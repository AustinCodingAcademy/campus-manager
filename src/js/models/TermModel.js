var Backbone = require('backbone');
var _ = require('underscore');

module.exports = Backbone.Model.extend({
  urlRoot: 'api/terms',
  idAttribute: '_id',

  defaults: {
    name: '',
    full: 0,
    courses: new Backbone.Collection()
  },

  initialize: function() {
    this.percentFull();
    this.on('sync', this.percentFull);
  },

  parse: function(obj) {
    if (obj.courses) {
      var CoursesCollection = require('../collections/CoursesCollection');
      _.each(obj.courses, course => {
        course.term = _.omit(obj, 'courses');
      });
      obj.courses = new CoursesCollection(obj.courses, { parse: true });
    }

    return obj;
  },

  percentFull: function() {
    if (this.get('courses') && this.get('courses').length) {
      var total = this.get('courses').reduce(function(memo, course) {
        return memo + course.get('seats');
      }, 0);
      var taken = this.get('courses').reduce(function(memo, course) {
        return memo + course.get('registrations').length;
      }, 0);
    }
    var percent = Math.round(taken / total * 100);
    this.set('full', percent);
    if (percent < 90) {
      this.set('health_color', 'red');
    } else if (percent < 95) {
      this.set('health_color', 'yellow');
    } else {
      this.set('health_color', 'green');
    }
  }

});
