var gulp = require('gulp');
var jest = require('gulp-jest');
var gutil = require('gulp-util');
var configs = require('./configs');

module.exports = function() {
    gulp.src(configs.paths.source)
        .pipe(jest({
            "scriptPreprocessor": "../node_modules/6to5-jest",
            "unmockedModulePathPatterns": [
                "./node_modules/"
            ]
        }))
        .on('error', gutil.log);
};