var changelog = require('changelog');
var fs = require('fs');
var packageObj = require('./package.json')

changelog.generate('react-responsive-carousel')
    .then(showChanges);

var allowedMessages = [
    'Allow',
    'Add',
    'Fix',
    'Remov',
    'Replac',
    'Updat',
    'Refact',
    'Deplo',
];

var notAllowedMessages = [
    /^[0-9.]+$/,
    /Merge pull request/,
    /Merge branch/,
    /Updating changelog/,
    /Prepare for publishing/
];

function any(list, message) {
    return list.filter(regexp => regexp.test(message)).length > 0;
};

var log = [];
function agreggate(message) {
    if (message.indexOf('Merge pull request') !== -1) {
        message = message.split('\n')
        .filter(line => line.trim() !== '')
        .map((line, index) => {
            if (index > 0) {
                return '    > ' + line;
            }

            return line;
        }).join('\n');
    }
    log.push(message);
    console.log(message);
}

function showChanges(data) {
    try{
        agreggate('# ' + packageObj.description);
        data.versions.forEach(function(version) {
            agreggate('\n\n## ' + version.version + ' - ' + new Date(version.date).toDateString());

            if (version.changes) {
                //version.changes is an array of commit messages for that version
                version.changes.forEach(function(change) {
                    if (!any(notAllowedMessages, change.message)) {
                        agreggate(' * ' + change.message);
                    }
                });
            }
        });

        fs.writeFileSync('CHANGELOG.md', log.join('\n'), { flag: 'w' });
    } catch(e) {
        console.log(e);
    }

}
