const { MessageEmbed } = require('discord.js');

const SpotifyWebApi = require('spotify-web-api-node')
const spotify = new SpotifyWebApi({
    clientId: "fa62679703a244b3b2cca2c326cbb3ac",
    clientSecret: "03d7cfec01b744d796002ce3aa983f30",
    redirectUri: "http://localhost",
});

const fs = require('fs');

spotify.setRefreshToken("AQB1p5iYM6D6WrKUIkV63j9j8quO371n5-q5sLLzTA7rVTw9cZfPTNFu4sFXVK6Jhdji5oSP73u4BnOKmJI0G5XsNLgozX8iZHm7HOSOZExsPdK62u6f6kQeMkd_9E1LO8Y");

spotify.refreshAccessToken().then(data => {
    spotify.setAccessToken(data.body.access_token);
}).catch(err => {
    console.error(err);
});

var expirationTime = 3600;

setInterval(() => {
    expirationTime--;
}, 1000);

const prefix = '!';

var currentFolder = '';
const embeds = addDirectory('embeds');

function addDirectory(directory) {
    currentFolder = directory;
    var fileList = {};

    for (const file of files) {
        if (!file.endsWith('.js')) {
            // 'file' is a folder
            currentFolder += `/${file}`;
            addDirectory(fs.readdirSync(currentFolder + '/'));
            currentFolder -= `/${file}`;
            continue;
        }
        const fileName = file.substr(0, file.length - 3);

        fileList[fileName] = require(`./${currentFolder}/${fileName}`);
    }

    return fileList;
}

function sendEmbed(message, source) {
    const embed = require(`./embeds/${source}`);

    return message.channel.send({ embeds: [embed] });
}

function connectVC(message) {
    const vc = message.member.voice.channel;
    if (!vc) return message.reply("Please connect to a voice channel");

    const connection = joinVoiceChannel({
        channelId: vc.id,
        guildId: vc.guild.id,
        adapterCreator: vc.guild.voiceAdapterCreator
    });

    connection.subscribe(player);
}

function spotifyRefresh() {
    if (expirationTime <= 0) {
        spotify.refreshAccessToken().then(data => {
            spotify.setAccessToken(data.body.access_token);
        }).catch(err => {
            console.error(err);
        });
    }
}

function runCommand(message) {
    var args = message.content.substring(prefix.length).toLowerCase().split(/ +/);
    var command = args.shift();

    if (!commands[command]) return;

    commands[command].execute(message, args);

    if (command !== 'again') {
        fs.writeFileSync("last_command.txt", message.content);
        console.log("logged last command: " + message.content);
    }
}

module.exports = {
    addDirectory: addDirectory,
    sendEmbed: sendEmbed,
    connectVC: connectVC,
    spotifyRefresh: spotifyRefresh,
    runCommand: runCommand,
    spotify: spotify
}