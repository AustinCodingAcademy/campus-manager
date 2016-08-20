var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var _ = require('underscore');

var userSchema = new Schema({
  "username" : {
    type: String,
    required: true,
    unique: true,
    index: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  "password" : String,
  "is_super": {
    type: Boolean,
    default: false
  },
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
    required: true
  },
  "last_name" : {
    type: String,
    required: true
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
  "idn": {
    type: Number,
    required: true,
    default: 1,
    unique: true
  },
  "client" : {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  attendance: Array,
  codecademy: String,
  zipcode: String,
  photo: String,
  grades: Array,
  courses: Array,
  reset_password: String,
  charges: Array,
  customer_id: String
}, { timestamps: true });

userSchema.virtual('gradeAverage').get(function() {
  var grades =  _.select(this.get('grades'), function(grade) { return _.isNumber(grade.score); });
  var num = grades.length;
  if (num) {
    return Math.round(_.reduce(_.pluck(grades, 'score'), function(memo, num) { return memo + num; }) / num);
  }
  return 0;
})

userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    delete ret.password;
    delete ret.client;
    delete ret.__v;
    delete ret.reset_password;
    delete ret.customer_id;
    return ret;
  },
  virtuals: true
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
