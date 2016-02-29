var Backbone = require('backbone');
var SessionModel = require('../models/sessionModel');

module.exports = Backbone.Collection.extend({
  url: 'api/sessions',
  model: SessionModel
});
