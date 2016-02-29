var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var sessionSchema = new Schema({	"start_date" : Date,	"end_date" : Date,	"name" : String});

module.exports = mongoose.model('session', sessionSchema);
