const { client } = require('../../main');
const { sendEmbed } = require('../../utils');
const { MessageEmbed } = require('discord.js');
const paginationEmbed = require('discord.js-pagination');
const {
    spotifyRefresh,
    spotify
} = require('../../utils');

var _interval;
var timer = 0; // timeout in seconds

function pladd(message, _) {
    sendEmbed(message, 'pladd_type').then(type_message => {
        type_message.react('🎵');
        type_message.react('🎶');
        type_message.react('❌')

        timer = 300;

        _interval = setInterval(() => timer--, 1000);

        typeReaction();

        function typeReaction() {
            client.once('messageReactionAdd', type_reaction => {
                if (timer <= 0) return;
                if (type_reaction.message.id !== type_message.id) return typeReaction();

                if (type_reaction.emoji == '🎵') {
                    message.channel.send("Please enter the title of the track...");

                    client.once('messageCreate', track_message => {
                        spotify.searchTracks(track_message.content, { limit: 5 }).then(response => {
                            const t_items = response.body.tracks.items;

                            let trackAndArtist_names = "";

                            for (var i = 0; i < t_items.length; i++) {
                                const trackAndArtist = "```" + (i - 1).toString() + ". " + t_items[i].name + ' - ' + t_items[i].artists[0].name + "```";
                                trackAndArtist_names += trackAndArtist;
                            }

                            const trackAndArtists_embed = new MessageEmbed()
                                .setColor(21481)
                                .setAuthor("Pick a track to add.")
                                .setDescription(trackAndArtist_names);

                            message.channel.send({ embeds: [trackAndArtists_embed] }).then(pick_message => {
                                pick_message.react('1️⃣');
                                pick_message.react('2️⃣');
                                pick_message.react('3️⃣');
                                pick_message.react('4️⃣');
                                pick_message.react('5️⃣');

                                trackReaction();

                                function trackReaction() {
                                    client.once('messageReactionAdd', track_reaction => {
                                        if (track_reaction.message.id !== pick_message.id) return trackReaction();

                                        var track;

                                        switch (track_reaction) {
                                            case '1️⃣':
                                                track = t_items[0];
                                                break;
                                            case '2️⃣':
                                                track = t_items[1];
                                                break;
                                            case '3️⃣':
                                                track = t_items[2];
                                                break;
                                            case '4️⃣':
                                                track = t_items[3];
                                                break;
                                            case '5️⃣':
                                                track = t_items[4];
                                                break;
                                            default:
                                                trackReaction();
                                                break;
                                        }

                                        let pages = [];
                                        let playlist_names = [];

                                        spotify.getUserPlaylists().then(playlists => {
                                            const pl_items = playlists.body.items;
                                            for (let i = 0; i < pl_items; i++) {
                                                if (i % 5 == 0) {
                                                    pages.push(new MessageEmbed());
                                                    playlist_names.push("");
                                                }

                                                const pl_name = "```" + (i + 1).toString() + ". " + pl_items[i].name + "```";

                                                playlist_names[Math.floor(i / 5)] += pl_name;
                                            }

                                            for (let i = 0; i < pages.length; i++) {
                                                pages[i].setColor(21481)
                                                    .setAuthor("Pick a playlist to add the song to.")
                                                    .setDescription(playlist_names[0])
                                            }

                                            paginationEmbed(message, pages).then(pl_pick_msg => {
                                                pl_pick_msg.react('1️⃣');
                                                pl_pick_msg.react('2️⃣');
                                                pl_pick_msg.react('3️⃣');
                                                pl_pick_msg.react('4️⃣');
                                                pl_pick_msg.react('5️⃣');

                                                playlistReaction();

                                                function playlistReaction() {
                                                    client.once('messageReactionAdd', pl_reaction => {
                                                        if (pl_reaction.message.id === pl_pick_msg.message.id) {

                                                            var playlist;

                                                            switch (pl_reaction) {
                                                                case '1️⃣':
                                                                    playlist = pl_items[0];
                                                                    break;
                                                                case '2️⃣':
                                                                    playlist = pl_items[1];
                                                                    break;
                                                                case '3️⃣':
                                                                    playlist = pl_items[2];
                                                                    break;
                                                                case '4️⃣':
                                                                    playlist = pl_items[3];
                                                                    break;
                                                                case '5️⃣':
                                                                    playlist = pl_items[4];
                                                                    break;
                                                                case '❌':
                                                                    return;
                                                                default:
                                                                    playlistReaction();
                                                                    break;
                                                            }

                                                            const confirm_embed = new MessageEmbed()
                                                                .setAuthor("Confirm adding track to playlist")
                                                                .addField("Are you sure want to add this track...", track.external_urls.spotify)
                                                                .addField("...to this playlist?", playlist.external_urls.spotify);

                                                            message.channel.send({ embeds: [confirm_embed] }).then(confirm_embed_msg => {
                                                                confirm_embed_msg.react('✅');
                                                                confirm_embed_msg.react('❌');

                                                                function confirmReaction() {
                                                                    client.once('messageReactionAdd', confirm_reaction => {
                                                                        if (confirm_reaction.emoji == '✅') {
                                                                            spotify.addTracksToPlaylist(playlist.id, [track.id]);
                                                                        } else if (confirm_reaction.emoji == '❌') return;
                                                                        else return confirmReaction();
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    });
                                }
                            });
                        });
                    });
                } else if (type_reaction.emoji == '🎶') {
                    // user wants to add album
                } else if (type_reaction.emoji == '❌') {
                    return;
                } else typeReaction();

            });
        }
    });
}

module.exports = { execute: pladd }