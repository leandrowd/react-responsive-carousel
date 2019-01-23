var configs = require('./tasks/configs');

var gulp = require('gulp');

var browserifyTask = require('./tasks/browserify');
var cssTask = require('./tasks/css');
var jestTask = require('./tasks/jest');
var connectTask = require('./tasks/connect');
var copyTask = require('./tasks/copy');
var ghPagesTask = require('./tasks/gh-pages');

gulp.task('webserver', function() {
  connectTask();
});

gulp.task('test', function(callback) {
  return jestTask(callback);
});

gulp.task('scripts', function() {
  return browserifyTask({
    environment: 'development'
  }).vendor();
})

gulp.task('scripts:production', function() {
  return browserifyTask({
    environment: 'production'
  }).vendor();
})

gulp.task('styles', function() {
  return cssTask({
    environment: 'development'
  });
})

gulp.task('styles:production', function() {
  return cssTask({
    environment: 'production'
  });
})

gulp.task('styles:package', function() {
  return cssTask({
    environment: 'package'
  });
})

gulp.task('copy', function() {
  return copyTask({
    environment: 'development'
  });
})

gulp.task('copy:package', function() {
  return copyTask({
    environment: 'package'
  });
})

gulp.task('copy:production', function() {
  return copyTask({
    environment: 'production'
  });
})

gulp.task('prepublish', ['test', 'scripts:production', 'styles:production', 'copy:production'])

gulp.task('publish', function(done) {
  return ghPagesTask(done);
})

// Development workflow
gulp.task('default', ['scripts', 'test', 'styles', 'copy', 'webserver'], function() {
  gulp.watch(configs.paths.source + "/**/*.js", ['scripts', 'test'])
    .on('change', function(event) {
      console.log('Scripts watcher trigger: ' + event.path + ' was ' + event.type + ', running tasks...');
    });

  gulp.watch(configs.paths.source + "/**/*.scss", ['styles'])
    .on('change', function(event) {
      console.log('Styles watcher trigger: ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
