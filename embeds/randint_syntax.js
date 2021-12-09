const { MessageEmbed } = require('discord.js');

const embed = new MessageEmbed()
    .setColor(21481)
    .setAuthor("COMMAND HELPER")
    .addField("Minimum and maximum value", "`randint <min> <max>`")
    .addField("Maximum value", "`randint <max>`");

module.exports = { embed: embed }