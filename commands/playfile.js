function playfile(message) {
    const attachments = message.attachments;
    var url;

    // takes the first audio attachment, unless there is none
    for (let a of attachments) {
        if (!a[1].contentType.match(/audio\/(?:mpeg|ogg|wav)/)) continue;

        url = a[1].url;
    }

    if (!url || attachments.length <= 0) return message.channel.send("Please attach an audio file of type .mp3, .ogg or .wav");

    connectVC(message);

    const song = createAudioResource(url);
    player.play(song);
}

module.exports = { execute: playfile }