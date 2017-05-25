const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const version = require('mongoose-version');

const trackSchema = new Schema({
  name: String,
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  client: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true });

trackSchema.plugin(version, { collection: 'tracks__versions' });

module.exports = mongoose.model('track', trackSchema);
