const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const version = require('mongoose-version');
const validators = require('mongoose-validators')

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
    validate: validators.isEmail()
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
  linkedIn: {
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
  api_key: String,
  attendance: Array,
  campus: String,
  charges: Array,
  courses: Array,
  credits: Array,
  customer_id: String,
  grades: Array,
  insightly: String,
  linkedIn: String,
  price: {
    type: Number,
    default: 0
  },
  reset_password: String,
  reviews: Array,
  rocketchat: String,
  zipcode: String,
  discourse: String,
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.__v;
    delete ret.reset_password;
    return ret;
  }
});

userSchema.plugin(uniqueValidator);

userSchema.plugin(version, { collection: 'users__versions' });

module.exports = mongoose.model('user', userSchema);
