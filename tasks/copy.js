var gulp = require('gulp');
var gulpCopy = require('gulp-copy');
var configs = require('./configs');

module.exports = function(options) {
    var destFolder = configs.paths[options.environment];
    return gulp.src([
        configs.paths.source + '/assets/**',
        configs.paths.source + '/styles/font/**',
        configs.paths.source + '/index.html'
    ])
    .pipe(gulpCopy(destFolder, {prefix: true}));
};