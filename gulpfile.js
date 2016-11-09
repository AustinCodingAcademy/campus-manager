'use strict';

if (['test', 'production'].indexOf(process.env.NODE_ENV) === -1) {
  require('dotenv').config();
}

if (process.env.NODE_ENV !== 'production') {
  var nodemon = require('nodemon');
  var DatabaseCleaner = require('database-cleaner');
  var databaseCleaner = new DatabaseCleaner('mongodb');
  var nightwatch = require('gulp-nightwatch');
  var mongo = require('mongodb');
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
var pixrem  = require('pixrem');
var postcss = require('gulp-postcss');
var pump = require('pump');
var CacheBreaker = require('gulp-cache-breaker');
var cb = new CacheBreaker();

gulp.task('bundle', function () {
  return browserify({
    entries: ['public/src/js/app.js'],
  })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('public/js/'));
});

gulp.task('compress', function (cb) {
  pump([
        gulp.src('public/js/bundle.js'),
        uglify(),
        gulp.dest('public/js/')
    ],
    cb
  );
});

gulp.task('bundle-dev', function() {
  return browserify({
    entries: ['public/src/js/app.js'],
    debug: true,
  })
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
  return gulp.src('views/*.pug')
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
    // runSequence(['bundle', 'sass'], 'compress', 'symlink-cb-paths', callback);
    runSequence(['bundle-dev', 'sass-dev'], callback);
  } else {
    runSequence(['bundle', 'sass'], 'compress', callback);
  }
});

gulp.task('clean-db', function() {
  mongo.connect('mongodb://localhost/test', function(err, db) {
    databaseCleaner.clean(db, function() {
      console.log('done');
      db.close();
    });
  });
});

gulp.task('start', function () {
  nodemon({
    script: './bin/www'
  , ext: 'js'
  , env: { 'NODE_ENV': 'development' }
  })
});

gulp.task('nodemon-start', function() {
  nodemon({
    script: './bin/www',
    env: {
      NODE_ENV: 'test',
      PORT: 8080,
      TEST_DB: 'mongodb://localhost/test',
      // These are one-off keys, not attached to any account
      STRIPE_SECRET_KEY: 'sk_test_lu7gj0g3NUFEfx31GwbdSxca',
      STRIPE_PUBLISHABLE_KEY: 'pk_test_LIWkhhJVRCPoGBO3SXaUXmTS',
      REGISTRATION_ENABLED: true,
      SESSION_KEY: 'foo'
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

gulp.task('test', function(callback) {
  runSequence('clean-db', 'nodemon-start', 'nightwatch', 'nodemon-quit', callback)
});

gulp.task('develop', ['start', 'bundle-dev', 'sass-dev']);
gulp.task('default', ['develop', 'watch']);
