var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
  "username" : String,
  "password" : String,
  "is_client" : {
    type: Boolean,
    default: false
  },
  "is_admin" : {
    type: Boolean,
    default: false
  },
  "is_instructor": {
    type: Boolean,
    default: false
  },
  "is_student": {
    type: Boolean,
    default: false
  },
  "first_name" : {
    type: String,
    default: ""
  },
  "last_name" : {
    type: String,
    default: ""
  },
  "phone": {
    type: String,
    default: ""
  },
  "github": {
    type: String,
    default: ""
  },
  "website": {
    type: String,
    default: ""
  },
  "idn": Number,
  "client" : {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  attendance: Array
});

userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.client;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('user', userSchema);
