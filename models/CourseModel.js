const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const version = require('mongoose-version');
const isAbsoluteUrl = require('is-absolute-url');

const fixUrl = (url) => {
  if (!url) return url;
  const splitUrl = url.split(' ').map(url => isAbsoluteUrl(url) ? url : `https://${url}`);
  return splitUrl.join(' ');
}

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
  textbooks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'textbook'
    }
  ],
  timeStart: {
    type: String,
    required: true
  },
  timeEnd: {
    type: String,
    required: true
  },
  withdrawals: [],
  note: String,
  section: Number,
  instructors: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user'
    }
  ],
  virtual: {
    type: String,
    get: fixUrl,
    set: fixUrl
  }
}, {
  timestamps: true,
  toObject: { getters: true, setters: true },
  toJSON: { getters: true, setters: true },
  runSettersOnQuery: true
 });

courseSchema.plugin(version, { collection: 'courses__versions' });

module.exports = mongoose.model('course', courseSchema);
