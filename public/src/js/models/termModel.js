var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  urlRoot: 'api/terms',
  idAttribute: '_id'
});
