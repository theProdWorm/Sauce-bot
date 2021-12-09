const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES'] });

const {
    runCommand,
    addDirectory
} = require('./utils');

const fs = require('fs');

var commands = {}

var currentFolder = 'commands';
addCommandDirectory(fs.readdirSync('commands'));

function addCommandDirectory(files) {
    for (const file of files) {
        if (!file.endsWith('.js')) {
            // 'file' is a folder
            currentFolder += `/${file}`;
            addCommandDirectory(fs.readdirSync(currentFolder + '/'));
            currentFolder -= `/${file}`;
            continue;
        }
        const commandName = file.substr(0, file.length - 3);

        commands[commandName] = require(`./${currentFolder}/${commandName}`);
    }
}

client.once('ready', () => {
    console.log(client.user.username + ' is online');
});

client.on('messageCreate', (message) => {
    if (!message.content.startsWith('!')) return; //prefix

    runCommand(message);
});

client.login('OTAyNTk4MDAxMzA5MTU1MzY4.YXgv5A.ZZVDGItOct76xM0ESkL0mC9Pdvw');

module.exports = { client: client }