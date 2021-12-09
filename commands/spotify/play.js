const {
    connectVC,
    spotifyRefresh,
    spotify
} = require('../../utils');

function play(message, args) {
    if (!args || args.length === 0) {
        spotify.getMyCurrentPlaybackState().then(state => {
            return state.body.is_playing
        }).then(isPlaying => {
            if (!isPlaying) spotify.play();
        });
        return;
    }

    connectVC(message);
    spotifyRefresh();

    spotify.search(args.join(' '), ['track'], { limit: 1 }).then(res => {
        return res.body.tracks.items[0];
    }).then(track => {
        spotify.play({ uris: [track.uri] });
    }).catch(err => {
        console.error(err);
    });
}

module.exports = { execute: play }