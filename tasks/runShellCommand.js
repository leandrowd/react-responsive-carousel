var exec = require('child_process').exec;

module.exports = function(shellCommand, callback) {
    exec(shellCommand, function(err) {
        callback(err);
    });
};
