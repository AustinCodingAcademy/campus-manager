'use strict';

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

if (process.env.NODE_ENV != 'production') {
  var nodemon = require('nodemon');
  var DatabaseCleaner = require('database-cleaner');
  var databaseCleaner = new DatabaseCleaner('mongodb');
  var nightwatch = require('gulp-nightwatch');
}

var browserify = require('browserify');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var pixrem  = require('pixrem');
var postcss = require('gulp-postcss');
var reactify = require('reactify');
var CacheBreaker = require('gulp-cache-breaker');
var cb = new CacheBreaker();
var envify = require('envify/custom');
var mongo = require('mongodb');

gulp.task('bundle', function () {
  return browserify({
    entries: ['public/src/js/app.js'],
    transform: [reactify]
  })
    .transform(envify())
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('bundle-dev', function() {
  return browserify({
    entries: ['public/src/js/app.js'],
    debug: true,
    transform: [reactify]
  })
  .transform(envify())
  .bundle().on('error', function(error) {
    console.log(error.toString());
    this.emit('end');
  })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js/'));
});

gulp.task('sass', function () {
  return gulp.src('public/src/scss/app.scss')
    .pipe(sass())
    .pipe(postcss([pixrem]))
    .pipe(autoprefixer({
      browsers: ['> 5%', 'last 2 versions']
    }))
    .pipe(cssnano({zindex: false}))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('sass-dev', function () {
  return gulp.src('public/src/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([pixrem]))
    .pipe(autoprefixer({
      browsers: ['> 5%', 'last 2 versions']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('html', function() {
  return gulp.src('views/*.jade')
    .pipe(cb.gulpCbPath('public'))
    .pipe(gulp.dest('views'));
});

// Write symlinks for all cache-broken paths from previous tasks.
gulp.task('symlink-cb-paths', ['html'], function() {
  cb.symlinkCbPaths();
});

gulp.task('watch', function () {
  gulp.watch('public/src/js/**', ['bundle-dev']);
  gulp.watch('public/src/scss/**', ['sass-dev']);
});

gulp.task('build', function(callback) {
  if (process.env.NODE_ENV === 'production') {
    runSequence(['bundle', 'sass'], 'symlink-cb-paths', callback);
  }
});

gulp.task('nodemon-start', function() {
  mongo.connect(process.env.TEST_DB, function(err, db) {
    databaseCleaner.clean(db, function() {
      nodemon({
        script: './bin/www',
        env: {
          NODE_ENV: 'test',
          PORT: 8080
        }
      });
    });
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

gulp.task('test', function(callback) {
  runSequence('nodemon-start', 'nightwatch', 'nodemon-quit', callback)
});

gulp.task('develop', ['bundle-dev', 'sass-dev']);
gulp.task('default', ['develop', 'watch']);
