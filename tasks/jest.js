var exec = require('child_process').exec;

module.exports = function(callback) {
    exec('yarn jest', function(err) {
        callback(err);
    });
};
