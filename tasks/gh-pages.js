var path = require('path');
var ghPages = require('gh-pages');
var configs = require('./configs');

module.exports = function(done) {
    return ghPages.publish(path.join(__dirname, `../${configs.demoWebsite}`), function(err) {
        if (err) {
            console.error('Failed to publish', err);
        } else {
            console.info('Published to gh-pages');
        }
        done();
    });
};
