var gulp = require('gulp');
var path = require('path');
var ghPages = require('gh-pages');
var configs = require('./configs');

module.exports = function(done) {
    var origin = configs.paths['production'];

    return ghPages.publish(origin, function () {
        console.log(arguments);
        done();
    });
};

