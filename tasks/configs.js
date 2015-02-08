var sourceFolder = 'src';
var devFolder = 'dev';
var productionFolder = 'dist';
var packageFolder = 'lib';

var configs = {
  folders: {
    source: sourceFolder,
    development: devFolder,
    production: productionFolder,
    package: packageFolder
  },
  paths: {
    source: './' + sourceFolder,
    development: './' + devFolder,
    production: './' + productionFolder,  
    package: './' + packageFolder
  }
}

module.exports = configs;