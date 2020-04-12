var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-clean-css');
var notify = require('gulp-notify');
var streamify = require('gulp-streamify');
var gutil = require('gulp-util');
var connect = require('gulp-connect');
var rename = require('gulp-rename');

var configs = require('./configs');

module.exports = function() {
    var start = new Date();
    var destFolder = `${configs.npmPackage}/styles`;

    gutil.log('Building CSS bundle');
    gulp.src([`./${configs.source}/carousel.scss`])
        .pipe(
            sass({
                errLogToConsole: true,
            })
        )
        // minify only in production
        .pipe(gulp.dest(destFolder))
        .pipe(streamify(minifyCSS()))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(destFolder))
        .pipe(
            notify(function() {
                gutil.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
            })
        )
        .pipe(connect.reload());
};
