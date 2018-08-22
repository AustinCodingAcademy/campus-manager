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
    entries: ['src/js/app.js'],
    transform: [
      [
        babelify,
        {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  browsers: [
                    "Chrome >= 59",
                    "FireFox >= 44",
                    "Safari >= 7",
                    "ie 11",
                    "last 4 Edge versions"
                  ]
                },
              }
            ],
            "@babel/preset-react",
          ],
          plugins: [
            "@babel/plugin-proposal-export-default-from",
            "@babel/plugin-proposal-logical-assignment-operators",
            ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
            ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
            ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
            "@babel/plugin-proposal-do-expressions",
          ]
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
  return gulp.src('src/scss/app.scss')
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
