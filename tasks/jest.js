var jest = require('jest-cli');
var configs = require('./configs');

var jestConfig = {
  rootDir: configs.paths.source,
  "unmockedModulePathPatterns": [
      "./node_modules/"
  ],
  verbose: false
};

module.exports = function(callback) {
    jest.runCLI({ config: jestConfig }, configs.paths.source, function(result) {
      if (!result || !result.success) {
        callback('Jest tests failed')
      } else {
        callback()
      }
    });
};
