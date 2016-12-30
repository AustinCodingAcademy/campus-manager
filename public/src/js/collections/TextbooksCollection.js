const Backbone = require('backbone');
const TextbookModel = require('../models/TextbookModel');

module.exports = Backbone.Collection.extend({
  url: 'api/textbooks',
  model: TextbookModel,
  comparator: 'name'
});
