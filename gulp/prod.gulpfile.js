var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var pixrem  = require('pixrem');
var postcss = require('gulp-postcss');
var CacheBreaker = require('gulp-cache-breaker');
var cb = new CacheBreaker();
var uglifyify = require('uglifyify');
var envify = require('envify');
var babelify = require('babelify');
var duration = require('gulp-duration');

gulp.task('bundle', function () {
  return browserify({
    entries: ['public/src/js/app.js'],
    transform: [
      [
        babelify,
        {
          presets: ['es2015', 'react']
        }
      ],
      envify
      [
        uglifyify,
        {
          global: true,
          ignore: [
            '**/node_modules/sql.js/**'
          ],
          dot: true
        }
      ]
    ]
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(duration('Javascript bundled'))
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

gulp.task('html', function() {
  return gulp.src('views/*.pug')
  .pipe(cb.gulpCbPath('public'))
  .pipe(gulp.dest('views'));
});

// Write symlinks for all cache-broken paths from previous tasks.
gulp.task('symlink-cb-paths', ['html'], function() {
  cb.symlinkCbPaths();
});
