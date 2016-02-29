var Backbone = require('backbone');
var UserModel = require('../models/userModel');

module.exports = Backbone.Collection.extend({
  url: 'api/users',
  model: UserModel
});
