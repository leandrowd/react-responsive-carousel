var gulp = require('gulp');
var jest = require('jest-cli');
var gutil = require('gulp-util');
var configs = require('./configs');

var jestConfig = {
  rootDir: configs.paths.source,
  "scriptPreprocessor": "../node_modules/6to5-jest",
  "unmockedModulePathPatterns": [
      "./node_modules/"
  ]
};

module.exports = function() {
    jest.runCLI({ config: jestConfig }), configs.paths.source, function() {
      done().on('error', gutil.log);
    };
};
