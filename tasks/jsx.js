var gulp = require('gulp');
var jsxTranspile = require('gulp-react');
var configs = require('./configs');

module.exports = function(options) {
    gulp.src(configs.paths.source + '/**/*.js')
      .pipe(jsxTranspile({
        harmony: true
      }))
      .pipe(gulp.dest(configs.paths[options.environment]))
};