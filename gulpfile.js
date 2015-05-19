var gulp = require('gulp');
var connect = require('gulp-connect');
var shell = require('gulp-shell');

var browserifyTask = require('./tasks/browserify');
var cssTask = require('./tasks/css');
var jestTask = require('./tasks/jest');
var jsxTask = require('./tasks/jsx');
var connectTask = require('./tasks/connect');

gulp.task('webserver', function () {
  connectTask();
});

gulp.task('test', function () {
  jestTask();
});

gulp.task('scripts', function() {
  browserifyTask({
    environment: 'development'
  });
})


// Development workflow
gulp.task('default', ['scripts', 'webserver'], function () {
  gulp.watch("src/main.js", ['scripts', 'test'])
    .on('change', function(event) {
      console.log('Scripts watcher trigger: ' + event.path + ' was ' + event.type + ', running tasks...');
    });  
});