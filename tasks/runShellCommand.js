const { spawn } = require('child_process');

module.exports = function(shellCommand, args, callback) {
    const command = spawn(shellCommand, args, {
        detached: true,
        stdio: 'ignore',
    });

    command.on('close', (code) => {
        if (code !== 0) {
            console.log(`command "${shellCommand}" exited with code ${code}`);
        }

        callback(code);
    });

    command.on('error', (err) => {
        console.error(`Failed while running "${shellCommand} ${args}"`, err);
    });
};
