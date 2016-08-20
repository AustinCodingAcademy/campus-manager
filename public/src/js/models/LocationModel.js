var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  urlRoot: 'api/locations',
  idAttribute: '_id',

  defaults: {
    name: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    phone: '',
    contact: ''
  }
});
