var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var courseSchema = new Schema({
	"name" : String,
	"term" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'term'
	},
	"client" : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	"days" : Array,
  "seats": Number,
  "registrations": [{ type: Schema.Types.ObjectId, ref: 'user' }],
  "holidays": Array,
  "grades": Array,
  "textbook": String,
	"videos": Array,
  "cost": {
    type: Number,
    default: 0.00
  }
});

module.exports = mongoose.model('course', courseSchema);
