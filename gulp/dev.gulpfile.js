var gulp = require('gulp');
var browserify = require('browserify');
var nodemon = require('nodemon');
var watchify = require('watchify');
var errorify = require('errorify');
var merge = require('utils-merge');
var buffer = require('vinyl-buffer');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var pixrem  = require('pixrem');
var postcss = require('gulp-postcss');
var envify = require('envify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var duration = require('gulp-duration');

gulp.task('bundle-dev', function() {
  var args = merge(watchify.args, {
    entries: ['src/js/app.js'],
    debug: true,
    transform: [ envify ],
    plugin: [
      [
        watchify,
        {
          delay: 100,
          ignoreWatch: ['**/node_modules/**'],
          poll: false
        }
      ],
      errorify
    ]
  });
  var b = browserify(args)

  b.on('update', bundle);
  b.on('end', function() {
    done();
  });
  bundle();

  function bundle() {
    console.log('Bundling JavaScript')
    b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(duration('Javascript bundled'))
    .pipe(gulp.dest('public/js/'));
  }
});

gulp.task('sass-dev', function () {
  return gulp.src('src/scss/app.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(postcss([pixrem]))
  .pipe(autoprefixer({
    browsers: ['> 5%', 'last 2 versions']
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('public/css/'));
});

gulp.task('watch', function () {
  gulp.watch('src/scss/**', ['sass-dev']);
  gulp.watch(['../[!node_modules]**/*.js', '../*.md'], ['docs']);
});

gulp.task('start', function () {
  nodemon({
    script: './bin/www',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  })
});
