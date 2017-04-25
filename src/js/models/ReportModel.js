var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  idAttribute: '_id',

  defaults: {
    results: [],
    columnHeaders: []
  },

  link: function(url, format, key) {
    return `${url.protocol}//${url.host}/api/${this.get('hash') ? `report/${this.get('hash')}` : url.hash.slice(1, -1)}?format=${format}&key=${key || ''}`
  }
});
