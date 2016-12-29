var gulp = require('gulp');
var nodemon = require('nodemon');
var DatabaseCleaner = require('database-cleaner');
var nightwatch = require('gulp-nightwatch');
var mongo = require('mongodb');

gulp.task('clean-db', function() {
  var databaseCleaner = new DatabaseCleaner('mongodb');
  mongo.connect('mongodb://localhost/campus-manager-test', function(err, db) {
    databaseCleaner.clean(db, function() {
      console.log('done');
      db.close();
    });
  });
});

gulp.task('nodemon-start', function() {
  nodemon({
    script: './bin/www',
    env: {
      NODE_ENV: 'test',
      PORT: 8080,
      TEST_DB: 'mongodb://localhost/test',
      // These are one-off keys, not attached to any account
      STRIPE_SECRET_KEY: 'sk_test_lvCpZcnc4rdLb5s87pG642Yr',
      STRIPE_PUBLISHABLE_KEY: 'pk_test_E71Myo8fhYgUb7DqSuP6MoCM',
      REGISTRATION_ENABLED: true,
      SESSION_KEY: 'foo',
      OAUTH_CLIENT_ID: 'id.apps.googleusercontent.com',
      OAUTH_CLIENT_SECRET: 'secret'
    }
  });
});

gulp.task('nightwatch', function() {
  return gulp.src('').pipe(nightwatch({
    configFile: "nightwatch.json"
  }));
});

gulp.task('nodemon-quit', function() {
  nodemon.once('exit', function () {
    process.exit(); // finish the exit process
  }).emit('quit');
});
