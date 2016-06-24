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
    textbook: '#'
  },

  shortDays: function() {
    return this.get('days').map(function(day) {
      return day.slice(0,3);
    }).join(', ');
  },

  classDates: function() {
    var that = this;
    var classDates = [];
    if (this.get('term')) {
      moment.range(this.get('term').get('start_date'), this.get('term').get('end_date')).by('days', function(day) {
        if (that.get('days').indexOf(day.format('dddd').toLowerCase()) > -1 &&
          that.get('holidays').indexOf(day.format('YYYY-MM-DD')) === -1) {
          classDates.push(day)
        }
      });
    }
    return classDates;
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
