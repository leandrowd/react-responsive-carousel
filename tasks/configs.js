var sourceFolder = 'src';
// development folder
var devFolder = 'dev';
// google pages folder
var productionFolder = 'dist';
// npm package folder
var packageFolder = 'lib';

var configs = {
  folders: {
    "source": sourceFolder,
    "development": devFolder,
    "production": productionFolder,
    "package": packageFolder,
  },
  paths: {
    "source": './' + sourceFolder,
    "development": './' + devFolder,
    "production": './' + productionFolder,  
    "package": './' + packageFolder
  }
}

module.exports = configs;