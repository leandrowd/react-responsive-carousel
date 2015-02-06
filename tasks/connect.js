var connect = require('gulp-connect');
var configs = require('./configs');

module.exports = function() {
  connect.server({
    root: configs.paths.development,
    livereload: true,
    port: 8000,
  });
}