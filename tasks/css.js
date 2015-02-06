var gulp = require('gulp');
var path = require('path');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var gulpif = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var notify = require('gulp-notify');
var streamify = require('gulp-streamify');
var gutil = require('gulp-util');
var connect = require('gulp-connect');

var configs = require('./configs');

module.exports = function (options) {
    if (!options || !options.environment) {
      options.environment = "development";
    }

    var isDevelopment = (options.environment === "development");
    var start = new Date();
    
    gutil.log('Building CSS bundle');
    gulp.src([configs.paths.source + '/**/*.scss'])
      .pipe(sass({
          includePaths: [
            configs.folders.source + '/components',
            configs.folders.source + '/styles'
          ],
          errLogToConsole: true
      }))
      // performing css imports
      .pipe(minifyCSS({
        keepSpecialComments: false,
        processImport: true,
        keepBreaks: true
      }))
      // minify only in production
      .pipe(gulpif(!isDevelopment, streamify(minifyCSS())))
      .pipe(gulp.dest(configs.paths[options.environment]))
      .pipe(notify(function () {
        gutil.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
      }))
      .pipe(connect.reload());
}
