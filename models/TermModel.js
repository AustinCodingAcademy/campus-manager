var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

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

module.exports = mongoose.model('term', termSchema);
