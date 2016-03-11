var Backbone = require('backbone');
var TermModel = require('./termModel');

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
    return obj;
  }
});
