'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var requireDir = require('require-dir');
var jsdoc = require('gulp-jsdoc3');
requireDir('./gulp');

if (['test', 'production'].indexOf(process.env.NODE_ENV) === -1) {
  require('dotenv').config();
}

gulp.task('build', function(callback) {
  var tasks = ['bundle', 'sass', 'docs'];
  if (process.env.NODE_ENV === 'production') {
    runSequence(tasks, 'symlink-cb-paths', callback);
  } else {
    runSequence(tasks, callback);
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

gulp.task('develop', ['start', 'bundle-dev', 'sass-dev', 'docs']);
gulp.task('default', ['develop', 'watch']);
