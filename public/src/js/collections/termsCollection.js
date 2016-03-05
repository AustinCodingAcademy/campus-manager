var Backbone = require('backbone');
var TermModel = require('../models/termModel');

module.exports = Backbone.Collection.extend({
  url: 'api/terms',
  model: TermModel
});
