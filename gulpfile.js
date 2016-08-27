var configs = require('./tasks/configs');

var gulp = require('gulp');
var connect = require('gulp-connect');
var shell = require('gulp-shell');

var browserifyTask = require('./tasks/browserify');
var cssTask = require('./tasks/css');
var jestTask = require('./tasks/jest');
var connectTask = require('./tasks/connect');
var copyTask = require('./tasks/copy');

gulp.task('webserver', function () {
  connectTask();
});

gulp.task('test', function () {
  jestTask();
});

gulp.task('scripts', function() {
  browserifyTask({
    environment: 'development'
  }).vendor();
})

gulp.task('styles', function(){
  cssTask({
    environment: 'development'
  });
})

gulp.task('styles:package', function(){
  cssTask({
    environment: 'package'
  });
})

gulp.task('copy', function(){
  copyTask({
    environment: 'development'
  });
})

gulp.task('deploy', ['test'], function () {
  browserifyTask({
    environment: 'production'
  })
  .vendor();

  cssTask({
    environment: 'production'
  });
});

// Development workflow
gulp.task('default', ['scripts', 'test', 'styles', 'copy', 'webserver'], function () {
  gulp.watch(configs.paths.source + "/**/*.js", ['scripts', 'test'])
    .on('change', function(event) {
      console.log('Scripts watcher trigger: ' + event.path + ' was ' + event.type + ', running tasks...');
    });

  gulp.watch(configs.paths.source + "/**/*.scss", ['styles'])
    .on('change', function(event) {
      console.log('Styles watcher trigger: ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
