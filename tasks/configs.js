var sourceFolder = 'src';
var devFolder = 'dev';
var productionFolder = 'dist';

var configs = {
  folders: {
    source: sourceFolder,
    development: devFolder,
    production: productionFolder
  },
  paths: {
    source: './' + sourceFolder,
    development: './' + devFolder,
    production: './' + productionFolder,  
  }
}

module.exports = configs;