'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
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

gulp.task('bundle', function () {
  return browserify({
    entries: ['public/src/js/app.js'],
    debug: true,
    transform: [reactify]
  }).bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/js/'));
});

gulp.task('sass', function () {
  return gulp.src('public/src/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([pixrem]))
    .pipe(autoprefixer({
      browsers: ['> 5%', 'last 2 versions']
    }))
    .pipe(cssnano({zindex: false}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/css/'));
});

gulp.task('watch', function () {
  gulp.watch('public/src/js/**', ['bundle']);
  gulp.watch('public/src/scss/**', ['sass']);
});

gulp.task('build', ['bundle', 'sass']);
gulp.task('default', ['build', 'watch']);
