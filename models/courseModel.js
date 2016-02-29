var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var courseSchema = new Schema({	"name" : String,	"days" : Number,  "session"  : { "type": Schema.ObjectId, "ref": "session" }});

module.exports = mongoose.model('course', courseSchema);
