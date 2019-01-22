var UserModel = require('./models/UserModel');
var _ = require('underscore');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

UserModel.find({}, function(err, users) {
  migrateAttendance(0, users);
});

function migrateAttendance(idx, users) {
  console.log(idx)
  user = users[idx];
  if (user) {
    user.attendance = user.attendance || []
    user.attendance = user.attendance.map(date => typeof date === 'string' ? { date } : date)
    return user.save(function(err, user) {
      migrateAttendance(++idx, users)
    });
  }
  process.exit()
}