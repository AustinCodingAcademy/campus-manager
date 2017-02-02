var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  urlRoot: 'api/locations',
  idAttribute: '_id',

  defaults: {
    results: [],
    timestamp: ''
  },

  link: function(url, format, key) {
    return `${url.protocol}//${url.host}/api/${url.hash.slice(1, -1)}?format=${format}&key=${key || ''}`
  }
});
