const Backbone = require('backbone');
const TrackModel = require('../models/TrackModel');

module.exports = Backbone.Collection.extend({
  url: 'api/tracks',
  model: TrackModel
});
