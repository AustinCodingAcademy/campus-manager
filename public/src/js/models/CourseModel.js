var Backbone = require('backbone');
var _ = require('underscore');
var TermModel = require('./TermModel');
var UsersCollection = require('../collections/UsersCollection');
var LocationModel = require('../models/LocationModel');
var moment = require('moment');
require('moment-range');

module.exports = Backbone.Model.extend({
  urlRoot: 'api/courses',
  idAttribute: '_id',

  defaults: {
    name: '',
    term: new TermModel(),
    seats: '',
    registrations: new UsersCollection(),
    textbook: '',
    days: [],
    holidays: [],
    cost: '',
    location: new LocationModel()
  },

  initialize: function() {
    this.set('attendance', new Backbone.Model({
      overTime: {
        data: {
          labels: [],
          datasets: [{
            data: []
          }]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      },
      student: {
        data: {
          labels: [],
          datasets: []
        },
        options: {
          tooltipTemplate: "<%= xLabel %> | <%= yLabel %> | <%= value === 0 ? 'Absent' : 'Present' %>",
          responsive: true,
          showLabels: false,
        }
      }
    }), {silent: true});
    var firstSync = true;
    this.on('sync', function() {
      if (firstSync) {
        this.attendanceOverTime();
        this.studentAttendance();
        this.get('attendance').trigger('change');
      }
      firstSync = false;
    }, this);
  },

  full: function() {
    return this.get('registrations').length >= this.get('seats');
  },

  shortDays: function() {
    return this.get('days').map(function(day) {
      return day.charAt(0).toUpperCase() + day.slice(1,3);
    }).join(', ');
  },

  properDays: function() {
    return this.get('days').map(function(day) {
      return day.charAt(0).toUpperCase() + day.slice(1);
    }).join(', ');
  },

  classDates: function() {
    return this.dates(moment(this.get('term').get('end_date'), 'YYYY-MM-DD'));
  },

  pastDates: function() {
    if (moment().isBefore(this.get('term').get('end_date'), 'YYYY-MM-DD')) {
      return this.dates(moment());
    } else {
      return this.dates(moment(this.get('term').get('end_date'), 'YYYY-MM-DD'));
    }
  },

  dates: function(endDate) {
    var that = this;
    var classDates = [];
    moment.range(this.get('term').get('start_date'), endDate.add(1, 'days')).by('days', function(day) {
      if (that.get('days').indexOf(day.format('dddd').toLowerCase()) > -1 &&
      that.get('holidays').indexOf(day.format('YYYY-MM-DD')) === -1) {
        classDates.push(day)
      }
    });
    return classDates;
  },

  studentAttendance: function() {
    var datasets = [];
    this.get('registrations').each(function(student) {
      datasets.push({
        label: student.fullName(),
        data: _.map(this.pastDates(), function(date) {
          return _.find(student.get('attendance'), function(checkIn) {
            return checkIn.slice(0, 10) === date.format('YYYY-MM-DD');
          }) ? 100 : 0;
        })
      });
    }, this);
    this.get('attendance').set({
      student: {
        data: {
          labels: _.map(this.pastDates(), function(date) { return date.format('ddd, MMM D'); }),
          datasets: datasets
        },
        options: this.get('attendance').get('student').options
      }
    }, { silent: true });
  },

  attendanceOverTime: function() {
    var data = [];
    var labels = [];
    _.each(this.pastDates(), function(date) {
      labels.push(date.format('ddd, MMM D'));
      var checkIns = 0;
      this.get('registrations').each(function(student) {
        var match = _.find(student.get('attendance'), function(checkIn) {
          if (moment(checkIn, 'YYYY-MM-DD HH:ss').isSame(date, 'day')) {
            checkIns++;
          }
        });
      });
      data.push(checkIns);
    }, this);
    this.get('attendance').set({
      overTime: {
        data: {
          labels: labels,
          datasets: [{
            data: data
          }]
        },
        options: this.get('attendance').get('overTime').options
      }
    }, { silent: true });
  },

  parse: function(obj) {
    if (obj.term) {
      obj.term = new TermModel(obj.term, { parse: true });
    }
    if (obj.registrations) {
      obj.registrations = new UsersCollection(obj.registrations, { parse: true });
    }

    if (obj.location) {
      var LocationModel = require('./LocationModel');
      obj.location = new LocationModel(obj.location, { parse: true });
    }

    return obj;
  },

  assignmentAverage: function(grade) {
    var assignmentGrades = [];
    this.get('registrations').each(function(student){
      var match = _.findWhere(student.get('grades'), { name: grade.name, courseId: this.id });
      if (!match) {
        student.get('grades').push({
          courseId: this.id,
          name: grade.name,
          score: ''
        });
      } else {
        if (_.isNumber(match.score)){
          assignmentGrades.push(match.score);
        }
      }
    }, this);
  }
});
