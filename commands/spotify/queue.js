const {
    spotifyRefresh,
    spotify
} = require('../../utils');

function queue(message, args) {
    spotifyRefresh();

    spotify.search(args.join(' '), ['track'], { limit: 1 }).then(res => {
        return res.body.tracks.items[0];
    }).then(track => {
        spotify.addToQueue(track.uri);
    }).catch(err => {
        console.error(err);
    });
}

module.exports = { execute: queue }