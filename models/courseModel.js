var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var courseSchema = new Schema({	"name" : String,	"days" : Number,  "session"  : {     type: Schema.Types.ObjectId,     ref: "session" },  "client" : {	 	type: Schema.Types.ObjectId,	 	ref: 'user'	}});

module.exports = mongoose.model('course', courseSchema);
