var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  urlRoot: 'api/users',
  idAttribute: 'id'
});
