var gulp = require('gulp');

var runShellCommand = require('./tasks/runShellCommand');
var ghPagesTask = require('./tasks/gh-pages');

gulp.task('test', function(done) {
    return runShellCommand('yarn', ['jest'], done);
});

gulp.task('build-website', function(done) {
    return runShellCommand('yarn', ['build-website'], done);
});

gulp.task('build-storybook', function(done) {
    return runShellCommand('yarn', ['build-storybook'], done);
});

gulp.task('build-styles', function(done) {
    return runShellCommand('yarn', ['build-styles'], done);
});

gulp.task('publish-gh-pages', ['test', 'build-website', 'build-storybook'], function(done) {
    return ghPagesTask(done);
});
