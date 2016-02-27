var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var courseSchema = new Schema({	"name" : String,	"days" : Number});

module.exports = mongoose.model('course', courseSchema);