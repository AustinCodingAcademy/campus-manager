'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var requireDir = require('require-dir');

if (['test', 'production'].indexOf(process.env.NODE_ENV) === -1) {
  require('dotenv').config();
}

if (process.env.NODE_ENV !== 'production') {
  requireDir('./gulp');
} else {
  requireDir('./gulp/prod.gulpfile.js');
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

gulp.task('develop', ['start', 'bundle-dev', 'sass-dev']);
gulp.task('default', ['develop', 'watch']);
