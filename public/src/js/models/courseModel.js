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
    seats: ''
  },
  
  shortDays: function() {
    return this.get('days').map(function(day) {
      return day.slice(0,3);
    }).join(', ');
  },
  
  parse: function(obj) {
    obj.term = new TermModel(obj.term);
    obj.registrations = new UsersCollection(obj.registrations);
    return obj;
  }
});
