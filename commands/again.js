const fs = require('fs');
const { runCommand } = require('../utils');

function again(message, args) {
    const lastCommand = fs.readFileSync("last_command.txt").toString();

    message.content = lastCommand;
    runCommand(message);
}

module.exports = {
    execute: again
}