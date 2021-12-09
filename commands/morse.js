const morseCode = {
    a: '.-',
    b: '-...',
    c: '.-.-',
    d: '-..',
    e: '.',
    f: '..-.',
    g: '--.',
    h: '....',
    i: '..',
    j: '.---',
    k: '-.-',
    l: '.-..',
    m: '--',
    n: '-.',
    o: '---',
    p: '.--.',
    q: '--.-',
    r: '.-.',
    s: '...',
    t: '-',
    u: '..-',
    v: '...-',
    w: '.--',
    x: '-..-',
    y: '-.--',
    z: '--..'
}
const dot = 120;

function morse(message, args) {
    var textToParse = args.join(' ').toLowerCase();

    connectVC(message);

    var skipped = [];
    let i = 0;
    (function loop() {
        if (textToParse[i] == ' ') setTimeout(loop, 7 * dot);

        if (!textToParse[i] || !textToParse[i].match(/[a-z]+/)) {
            if (++i < textToParse.length) loop();
            return;
        }

        const code = createAudioResource(`morse/${textToParse[i]}.mp3`);
        player.play(code);

        const morseLetter = morseCode[textToParse[i]]
        let delay = 0;

        for (let i = 0; i < morseLetter.length; i++) {
            if (morseLetter[i] === '.') delay += dot;
            else if (morseLetter[i] === '-') delay += 3 * dot;
            else console.log('invalid morse sign: ' + morseLetter[i]);
        }

        if (++i < textToParse.length) setTimeout(loop, 3 * dot + delay);
    })();

    // tells sender how to message is interpreted unless interpretation equals the message
    if (!textToParse.search(/[^a-z]/)) {
        let readAs = "";
        for (let l of textToParse) {
            if (l.match(/(?:[a-z]| )/)) readAs += l;
        };

        message.reply(`Reading as "${readAs}"`);
    }
}

module.exports = {
    execute: morse
}