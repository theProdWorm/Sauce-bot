const {
    spotifyRefresh,
    spotify
} = require('../../utils');

function pause(message, _) {
    spotifyRefresh();

    spotify.getMyCurrentPlaybackState().then(state => {
        if (state.body.is_playing) {
            spotify.pause();
        } else {
            message.reply("Playback already paused");
        }
    })
}

module.exports = { execute: pause }