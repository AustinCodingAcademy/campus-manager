const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const querySchema = new Schema({
  data: {
    type: Object,
    required: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('query', querySchema);
