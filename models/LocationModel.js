var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var locationSchema = new Schema({	'address' : String,	'name' : String,	'city' : String,	'state' : String,	'zipcode' : String,	'contact' : String,  'client' : {	 	type: Schema.Types.ObjectId,	 	ref: 'user'	},  'phone': String});

module.exports = mongoose.model('location', locationSchema);
