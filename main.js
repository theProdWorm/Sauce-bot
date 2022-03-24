const Discord = require('discord.js');
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES', 'DIRECT_MESSAGES'] });

const {
    runCommand
} = require('./utils');

client.once('ready', () => {
    console.log(client.user.username + ' is online');
});

client.on('messageCreate', (message) => {
    if (!message.content.startsWith('!')) return; //prefix

    runCommand(message);
});

client.login(process.env.TOKEN);

module.exports = { client: client }