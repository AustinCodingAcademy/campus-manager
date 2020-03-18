import * as Backbone from 'backbone';
const utils = require('../utils');
const _ = require('underscore');
const moment = require('moment');

module.exports = Backbone.Model.extend({
  urlRoot: 'api/users',
  idAttribute: '_id',

  defaults: {
    idn: '',
    is_student: false,
    is_admin: false,
    is_instructor: false,
    github: '',
    insightly: '',
    website: '',
    phone: '',
    username: '',
    first_name: '',
    last_name: '',
    paymentAmount: 0.00,
    credits: [],
    api_key: '',
    reviews:[],
    price: 0,
    charges:[],
    linkedIn: ''
  },

  fullName() {
    return `${this.get('last_name')}, ${this.get('first_name')}`;
  },

  displayName() {
    return `${this.get('first_name')} ${this.get('last_name')}`;
  },

  roles() {
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
    return roles;
  },

  overallAttendance() {
    const courseDates = [];
    this.get('courses').each(course => {
      courseDates.push.apply(courseDates, _.map(course.pastDates(), date => {
        return date.format('YYYY-MM-DD');
      }));
    });
    return this.attendanceAverage(courseDates);
  },

  courseAttendance(course) {
    return this.attendanceAverage(_.map(course.pastDates(), date => {
      return date.format('YYYY-MM-DD');
    }));
  },

  attendanceAverage(attendedDates) {
    attendedDates = _.uniq(attendedDates);
    const attendance = _.uniq(_.map(this.get('attendance'), date => {
      return moment(date.date, 'YYYY-MM-DD HH:ss').format('YYYY-MM-DD');
    }));
    return Math.round(_.intersection(attendedDates, attendance).length / attendedDates.length * 100) || 0;
  },

  averageChartData(score) {
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

  profileComplete() {
    const attrs = [
      'first_name',
      'last_name',
      'username',
      'phone',
      'github',
      'rocketchat',
      'website',
      'zipcode',
      'linkedIn'
    ]
    return Math.round(_.filter(attrs, attr => {
      return this.get(attr);
    }, this).length / attrs.length * 100);
  },

  parse(obj) {
    if (obj.courses) {
      const CoursesCollection = require('../collections/CoursesCollection');
      obj.courses = new CoursesCollection(obj.courses, { parse: true });
    }
    return obj;
  },

  overallGrade() {
    const studentDailyGrades = [];
    const studentCheckpointGrades = [];
    this.get('grades').filter(grade => {
      return _.isNumber(grade.score);
    }).forEach(grade => {
      const course = this.get('courses').get(grade.courseId);
      if (course) {
        const courseGrade = course.get('grades').find((courseGrade) => {
          return courseGrade.name === grade.name && course.id === grade.courseId;
        });
        if (courseGrade) {
          if (courseGrade.checkpoint) {
            studentCheckpointGrades.push(Number(grade.score));
          } else {
            studentDailyGrades.push(Number(grade.score));
          }
        }
      }
    });
    return utils.weightedGradeAverage(studentCheckpointGrades, studentDailyGrades);
  },

  courseGrade(course) {
    const studentDailyGrades = [];
    const studentCheckpointGrades = [];
    this.get('grades').filter(grade => {
      return _.isNumber(grade.score);
    }).forEach(grade => {
      const courseGrade = course.get('grades').find((courseGrade) => {
        return courseGrade.name === grade.name && course.id === grade.courseId;
      });
      if (courseGrade) {
        if (courseGrade.checkpoint) {
          studentCheckpointGrades.push(Number(grade.score));
        } else {
          studentDailyGrades.push(Number(grade.score));
        }
      }
    });
    return utils.weightedGradeAverage(studentCheckpointGrades, studentDailyGrades);
  },

  currentCourse() {
    return this.get('courses').find(course => {
      return moment().isBetween(course.get('term').get('start_date'), course.get('term').get('end_date'));
    }) || this.futureCourse() || this.lastCourse() || this.blankCourse();
  },

  futureCourse() {
    return _.first(this.get('courses').filter(course => {
      return moment().isBefore(course.get('term').get('start_date'));
    }).sort((a, b) => {
      return a.get('term').get('start_date') < b.get('term').get('start_date') ? -1 : 1
    }));
  },

  lastCourse() {
    return this.get('courses').first();
  },

  blankCourse() {
    const CourseModel = require('./CourseModel');
    return new CourseModel();
  }
});
