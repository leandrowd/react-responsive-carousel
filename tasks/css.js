var gulp = require('gulp');
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var minifyCSS = require('gulp-clean-css');
var notify = require('gulp-notify');
var streamify = require('gulp-streamify');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var rename = require("gulp-rename");

var configs = require('./configs');

module.exports = function (options) {
    if (!options || !options.environment) {
      options.environment = "development";
    }

    var isDevelopment = (options.environment === "development");
    var isPackage = (options.environment === "package");

    var destFolder = configs.paths[options.environment];

    if (isPackage) destFolder += '/styles/';

    var start = new Date();

    gutil.log('Building CSS bundle');
    gulp.src([configs.paths.source + '/**/*.scss'])
      .pipe(sass({
          errLogToConsole: true
      }))
      // minify only in production
      .pipe(gulp.dest(destFolder))
      .pipe(gulpif(!isDevelopment, streamify(minifyCSS())))
      .pipe(gulpif(!isDevelopment, rename({
        suffix: '.min'
      })))
      .pipe(gulpif(!isDevelopment, gulp.dest(destFolder)))
      .pipe(notify(function () {
        gutil.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
      }))
      .pipe(connect.reload());
};
