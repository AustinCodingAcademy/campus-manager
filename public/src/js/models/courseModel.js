var Backbone = require('backbone');
var _ = require('underscore');
var TermModel = require('./termModel');
var UsersCollection = require('../collections/usersCollection');

module.exports = Backbone.Model.extend({
  urlRoot: 'api/courses',
  idAttribute: '_id',
  
  defaults: {
    name: '',
    term: new TermModel(),
    seats: '',
    registrations: new UsersCollection()
  },
  
  shortDays: function() {
    return this.get('days').map(function(day) {
      return day.slice(0,3);
    }).join(', ');
  },
  
  parse: function(obj) {
    if (obj.term) {
      obj.term = new TermModel(obj.term);
    }
    if (obj.registrations) {
      obj.registrations = new UsersCollection(obj.registrations);
    }
    return obj;
  }
});
