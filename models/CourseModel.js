var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongooseToCsv = require('mongoose-to-csv');

var courseSchema = new Schema({
	name : String,
	term : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'term',
    required: true
	},
	client : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	days : Array,
  seats: Number,
  registrations: [{
    type: Schema.Types.ObjectId,
    ref: 'user'
  }],
  holidays: Array,
  grades: Array,
  textbook: String,
	videos: Array,
  cost: {
    type: Number,
    default: 0.00
  },
  location: {
	 	type: Schema.Types.ObjectId,
	 	ref: 'location',
    required: true
	}
}, { timestamps: true });

courseSchema.plugin(mongooseToCsv, {
  headers: 'id name seats term_id location_id cost',
  constraints: {},
  virtuals: {
    id: function(doc) {
      return doc._id.toString();
    },
    term_id: function(doc) {
      return doc.term.toString();
    },
    location_id: function(doc) {
      return doc.location.toString();
    }
  }
});

module.exports = mongoose.model('course', courseSchema);
