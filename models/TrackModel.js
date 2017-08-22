const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const version = require('mongoose-version');
const mongooseDelete = require('mongoose-delete');

const trackSchema = new Schema({
  name: String,
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'course'
  }],
  client: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true });

trackSchema.plugin(version, { collection: 'tracks__versions' });

trackSchema.plugin(mongooseDelete, {
  deletedAt : true,
  overrideMethods: true,
  indexFields: true
});

module.exports = mongoose.model('track', trackSchema);
