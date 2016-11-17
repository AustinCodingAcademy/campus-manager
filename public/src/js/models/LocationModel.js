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
    contact: '',
    note: ''
  },

  fullAddress: function() {
    return this.get('name') + ', ' + this.get('address') + ', ' + this.get('city') + ', ' + this.get('state') + ' ' + this.get('zipcode');
  },

  locationAddress: function() {
    return this.get('name') + '\n' + this.get('address') + '\n' + this.get('city') + ', ' + this.get('state') + '  ' + this.get('zipcode') + '\n' + this.get('note');
  }
});
