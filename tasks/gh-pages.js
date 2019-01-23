var path = require('path');
var ghPages = require('gh-pages');

module.exports = function(done) {
    return ghPages.publish(path.join(__dirname, '../dist'), function (err) {
        if (err) {
            console.error('Failed to publish', err);
        } else {
            console.info('Published to gh-pages');
        }
        done();
    });
};

