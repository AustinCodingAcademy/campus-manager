var Backbone = require('backbone');
var _ = require('underscore');
var TermModel = require('./TermModel');
var UsersCollection = require('../collections/UsersCollection');
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
    textbook: '#',
    days: [],
    holidays: []
  },

  shortDays: function() {
    return this.get('days').map(function(day) {
      return day.slice(0,3);
    }).join(', ');
  },

  classDates: function() {
    return this.dates(moment(this.get('term').get('end_date'), 'YYYY-MM-DD'));
  },

  pastDates: function() {
    if (moment().isBefore(this.get('term').get('end_date'), 'YYYY-MM-DD')) {
      return this.dates(moment());
    }
    return this.dates(moment(this.get('term').get('end_date'), 'YYYY-MM-DD'));
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
            return moment(checkIn, 'YYYY-MM-DD HH:mm').isSame(date, 'day');
          }) ? 100 : 0;
        })
      });
    }, this);
    return {
      data: {
        labels: _.map(this.pastDates(), function(date) { return date.format('ddd, MMM D'); }),
        datasets: datasets
      },
      options: {
        tooltipTemplate: "<%= xLabel %> | <%= yLabel %> | <%= value === 0 ? 'Absent' : 'Present' %>",
        responsive: true,
        showLabels: false,
      }
    }
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
    return {
      data: {
        labels: labels,
        datasets: [{
          data: data
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
    };
  },

  parse: function(obj) {
    if (obj.term) {
      obj.term = new TermModel(obj.term, { parse: true });
    }
    if (obj.registrations) {
      obj.registrations = new UsersCollection(obj.registrations, { parse: true });
    }
    return obj;
  }
});
