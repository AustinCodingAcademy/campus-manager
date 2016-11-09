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
    paymentAmount: 0.00,
    credits: ''
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
    return Math.round(_.intersection(courseDates, attendance).length / courseDates.length * 100) || 0;
  },

  averageChartData: function(score) {
    return {
      data: {
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

  profileComplete: function() {
    var attrs = [
      'first_name',
      'last_name',
      'username',
      'phone',
      'github',
      'website',
      'codecademy',
      'zipcode'
    ]
    return Math.round(_.filter(attrs, function(attr) {
      return !!this.get(attr);
    }, this).length / attrs.length * 100);
  },

  parse: function(obj) {
    if (obj.courses) {
      var CoursesCollection = require('../collections/CoursesCollection');
      obj.courses = new CoursesCollection(obj.courses, { parse: true });
    }
    return obj;
  },

  gradeAverage: function() {
    var studentDailyGrades = [];
    var studentCheckpointGrades = [];
    _.each(this.get('grades'), function(grade) {
      var course = this.get('courses').get(grade.courseId);
      if (course) {
        var courseGrade = _.findWhere(course.get('grades'), { name: grade.name });
        if (courseGrade) {
          if (courseGrade.checkpoint) {
            studentCheckpointGrades.push(Number(grade.score));
          } else {
            studentDailyGrades.push(Number(grade.score));
          }
        }
      }
    }, this);

    var dailyAverage = 0;
    var dailyLength = studentDailyGrades.length;
    if (dailyLength) {
      dailyAverage = _.reduce(studentDailyGrades, function(memo, dailyLength) { return memo + dailyLength; }) / dailyLength;
    }

    var checkpointAverage = 0;
    var checkpointLength = studentCheckpointGrades.length;
    if (checkpointLength) {
      checkpointAverage = _.reduce(studentCheckpointGrades, function(memo, checkpointLength) { return memo + checkpointLength; }) / checkpointLength;
    }

    if (!checkpointAverage && !dailyAverage){
      this.grade_average = 0;
    } else if (!checkpointAverage) {
      this.grade_average = Math.round(dailyAverage);
    } else if (!dailyAverage) {
      this.grade_average = Math.round(checkpointAverage);
    } else {
      this.grade_average = Math.round(dailyAverage * .3 + checkpointAverage * .7);
    }

    return this.grade_average;
  }
});
