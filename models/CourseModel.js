const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const version = require('mongoose-version');

const courseSchema = new Schema({
	name: String,
	term: {
	 	type: Schema.Types.ObjectId,
	 	ref: 'term',
    required: true
	},
	client: {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	days: Array,
  seats: Number,
  registrations: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  holidays: Array,
  grades: Array,
	videos: Array,
  cost: {
    type: Number,
    default: 0.00
  },
  location: {
	 	type: Schema.Types.ObjectId,
	 	ref: 'location',
    required: true
	},
  textbook: {
	 	type: Schema.Types.ObjectId,
	 	ref: 'textbook'
	},
  timeStart: {
    type: String,
    required: true
  },
  timeEnd: {
    type: String,
    required: true
  },
  withdrawals: [],
  note: String
}, { timestamps: true });

courseSchema.plugin(version, { collection: 'courses__versions' });

module.exports = mongoose.model('course', courseSchema);
