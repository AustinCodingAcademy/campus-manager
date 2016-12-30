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

  link() {
    return `https://www.google.com/maps/search/${this.get('name')} ${this.get('address')} ${this.get('city')} ${this.get('state')} ${this.get('zipcode')}`.split(' ').join('+');
  }
});
