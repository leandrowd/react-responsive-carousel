var gulp = require('gulp');
var gulpCopy = require('gulp-copy');
var configs = require('./configs');

module.exports = function(options) {
    var destFolder = configs.paths[options.environment];
    var files = [
        configs.paths.source + '/assets/**',
        configs.paths.source + '/styles/font/**',
        configs.paths.source + '/index.html'
    ];

    if (options.environment === 'production') {
        files.push('CNAME');
    }

    return gulp.src(files)
        .pipe(gulpCopy(destFolder, {
            prefix: true
        }));
};