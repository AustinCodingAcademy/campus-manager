var Backbone = require('backbone');
var utils = require('../utils');
var _ = require('underscore');
var moment = require('moment');

module.exports = Backbone.Model.extend({
  urlRoot: 'api/users',
  idAttribute: '_id',

  defaults: {
    idn: '',
    is_student: false,
    is_admin: false,
    is_instructor: false,
    github: '',
    website: '',
    phone: '',
    username: '',
    first_name: '',
    last_name: '',
    courses: []
  },

  fullName: function() {
    return this.get('last_name') + ', ' + this.get('first_name');
  },

  roles: function() {
    var roles = [];
    if (this.get('is_client')) {
      roles.push('client');
    }
    if (this.get('is_admin')) {
      roles.push('admin');
    }
    if (this.get('is_instructor')) {
      roles.push('instructor');
    }
    if (this.get('is_student')) {
      roles.push('student');
    }
    return roles.join(', ');
  },

  attendanceAverage: function() {
    var courseDates = [];
    this.get('courses').each(function(course) {
      _.each(course.pastDates(), function(date) {
        courseDates.push(date.format('YYYY-MM-DD'));
      });
    });
    courseDates = _.uniq(courseDates);
    var attendance = _.uniq(_.map(this.get('attendance'), function(date) { return moment(date, 'YYYY-MM-DD HH:ss').format('YYYY-MM-DD'); }));
    return Math.round(_.intersection(courseDates, attendance).length / courseDates.length * 100);
  },

  averageChartData: function(score) {
    return {
      chart: {
        labels: ['', ''],
        datasets: [
          {
            data: [score, 100 - score],
            backgroundColor: [utils.scoreColor(score), 'white']
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        }
      }
    };
  },

  parse: function(obj) {
    if (obj.courses) {
      var CoursesCollection = require('../collections/CoursesCollection');
      obj.courses = new CoursesCollection(obj.courses, { parse: true });
    }
    return obj;
  }
});
