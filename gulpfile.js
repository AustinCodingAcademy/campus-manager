'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var requireDir = require('require-dir');
var webserver = require('gulp-webserver');
var jsdoc = require('gulp-jsdoc3');
requireDir('./gulp');

if (['test', 'production'].indexOf(process.env.NODE_ENV) === -1) {
  require('dotenv').config();
}

gulp.task('build', function(callback) {
  if (process.env.NODE_ENV === 'production') {
    runSequence(['bundle', 'sass'], 'symlink-cb-paths', callback);
  } else {
    process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_LIWkhhJVRCPoGBO3SXaUXmTS';
    runSequence(['bundle', 'sass'], callback);
  }
});

gulp.task('test', function(callback) {
  runSequence('clean-db', 'nodemon-start', 'nightwatch', 'nodemon-quit', callback)
});

gulp.task('docs', function (cb) {
  var config = require('./jsdoc.conf.json');
  gulp.src(['./README.md', './[!node_modules]**/*.js'], {read: true})
  .pipe(jsdoc(config, cb));
});


gulp.task('webserver', function() {
  gulp.src('./docs')
  .pipe(webserver({
    host: '127.0.0.1',
    port: '3001',
    directoryListing: false
  }));
});

gulp.task('develop', ['start', 'bundle-dev', 'sass-dev']);
gulp.task('default', ['develop', 'watch']);
