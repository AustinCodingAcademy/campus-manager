var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('underscore');
var mongooseToCsv = require('mongoose-to-csv');
var version = require('mongoose-version');

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: String,
  is_client: {
    type: Boolean,
    default: false
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  is_instructor: {
    type: Boolean,
    default: false
  },
  is_student: {
    type: Boolean,
    default: false
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    default: ""
  },
  github: {
    type: String,
    default: ""
  },
  website: {
    type: String,
    default: ""
  },
  idn: {
    type: Number,
    required: true,
    default: 1,
    unique: true
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  attendance: Array,
  codecademy: String,
  zipcode: String,
  grades: Array,
  courses: Array,
  reset_password: String,
  charges: Array,
  customer_id: String,
  credits: String,
  api_key: String,
  price: Number,
  reviews: Array,
  rocketchat: String,
  campus: String,
  insightly: String
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.__v;
    delete ret.reset_password;
    delete ret.customer_id;
    return ret;
  },
  virtuals: true
});

userSchema.plugin(uniqueValidator);

userSchema.plugin(mongooseToCsv, {
  headers: 'id idn first_name last_name email phone zipcode github website customer_id is_admin is_client is_instructor is_student price insightly',
  constraints: {
    email: 'username'
  },
  virtuals: {
    id: function(doc) {
      return doc._id.toString();
    }
  }
});

userSchema.plugin(version, { collection: 'users__versions' });

module.exports = mongoose.model('user', userSchema);
