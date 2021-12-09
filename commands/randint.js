const { help } = require('../utils');
const { randomInt } = require('crypto');

function randint(message, args) {
    var min = parseInt(args[0]);
    var max = parseInt(args[1]);
    var result;

    if (!min ^ !max) result = randomInt(min);
    if (!min && !max) return help(message);
    if (!min || !max) return message.reply("Please enter only integer numbers.");

    const isNegative = Math.random() < 0.5;
    result = Math.random() * (isNegative ? min : max);

    message.channel.send(`\`Result: ${result}\``);
}

module.exports = {
    execute: randint
}