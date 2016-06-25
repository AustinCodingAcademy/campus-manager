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
    days: []
  },

  shortDays: function() {
    return this.get('days').map(function(day) {
      return day.slice(0,3);
    }).join(', ');
  },

  classDates: function() {
    return this.dates(this.get('term').get('end_date'));
  },

  pastDates: function() {
    return this.dates(moment());
  },

  dates: function(endDate) {
    var that = this;
    var classDates = [];
    moment.range(this.get('term').get('start_date'), endDate).by('days', function(day) {
      if (that.get('days').indexOf(day.format('dddd').toLowerCase()) > -1 &&
        that.get('holidays').indexOf(day.format('YYYY-MM-DD')) === -1) {
        classDates.push(day)
      }
    });
    return classDates;
  },

  attendanceOverTime: function() {
    var data = [];
    var labels = [];
    _.each(this.pastDates(), function(date) {
      labels.push(date.format('ddd, MMM Do'));
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
      chart: {
        labels: labels,
        datasets: [{
          data: data
        }]
      },
      options: {
        legend: {
          display: false
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
