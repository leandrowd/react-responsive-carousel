var path = require('path');
var ghPages = require('gh-pages');

module.exports = function(done) {
    return ghPages.publish(path.join(__dirname, '../temp/website'), function(err) {
        if (err) {
            console.error('Failed to publish', err);
        } else {
            console.info('Published to gh-pages');
        }
        done();
    });
};
