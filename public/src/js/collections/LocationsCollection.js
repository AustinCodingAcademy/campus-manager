var Backbone = require('backbone');
var LocationModel = require('../models/LocationModel');

module.exports = Backbone.Collection.extend({
  url: 'api/locations',
  model: LocationModel,
  comparator: 'name'
});
