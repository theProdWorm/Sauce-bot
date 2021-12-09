const { MessageEmbed } = require('discord.js');

const embed = new MessageEmbed()
    .setColor(21481)
    .setAuthor("What do you want to add?")
    .setDescription("React with the corresponding emoji")
    .addField("A single track", "🎵")
    .addField("A full album", "🎶")
    .addField("Cancel", '❌');

module.exports = { embed: embed }