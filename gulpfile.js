var configs = require('./tasks/configs');

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

gulp.task('styles', function(){
  cssTask({
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

gulp.task('package', ['test'], function () {
  // pack js files to npm
  jsxTask({
    environment: 'package'
  });

  cssTask({
    environment: 'package'
  });
});

// Development workflow
gulp.task('default', ['scripts', 'test', 'styles', 'webserver'], function () {
  gulp.watch(configs.paths.source + "/**/*.js", ['scripts', 'test'])
    .on('change', function(event) {
      console.log('Scripts watcher trigger: ' + event.path + ' was ' + event.type + ', running tasks...');
    });

  gulp.watch(configs.paths.source + "/**/*.scss", ['styles'])
    .on('change', function(event) {
      console.log('Styles watcher trigger: ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
