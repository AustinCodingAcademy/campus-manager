var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var mongooseToCsv = require('mongoose-to-csv');
var moment = require('moment');

var termSchema = new Schema({
	"start_date" : Date,
	"end_date" : Date,
	"name" : String,
	"client" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
  courses: [],
  "location": {
	 	type: Schema.Types.ObjectId,
	 	ref: 'location'
	}
}, { timestamps: true });

termSchema.plugin(mongooseToCsv, {
  headers: 'id name date_start date_end location_id',
  constraints: {},
  virtuals: {
    id: function(doc) {
      return doc._id.toString();
    },
    date_start: function(doc) {
      return moment.utc(doc.start_date).format('YYYY-MM-DD');
    },
    date_end: function(doc) {
      return moment.utc(doc.end_date).format('YYYY-MM-DD');
    },
    location_id: function(doc) {
      return doc.location.toString();
    }
  }
});

module.exports = mongoose.model('term', termSchema);
