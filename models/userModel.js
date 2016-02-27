var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({	"username" : String,	"password" : String,  "client" : Boolean,  "admin" : Boolean,  "instructor" : Boolean,  "student" : Boolean,  "first_name" : String,  "last_name" : String,  "phone": String});

module.exports = mongoose.model('user', userSchema);
