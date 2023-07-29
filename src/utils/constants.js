const { QueryType } = require("discord-player");
const ffmpeg = require("@ffmpeg-installer/ffmpeg");

/**
 * Custom ffmpeg source
 * Starting from discord-player@6.3.0 requires manually setting the ffmpeg path
 */
process.env.FFMPEG_PATH = ffmpeg.path;
process.env.DP_NO_FFMPEG_WARN = true; // Mute ffmpeg warning

const RABELAO = "oRaBellenda";
const gemidos = ["https://www.youtube.com/watch?v=zV5inlgqxMo", "https://youtu.be/r6HEBsr2NQQ"];
const randomGemido = gemidos[Math.floor(Math.random() * gemidos.length)];
const rickRollUrl = "https://youtu.be/dQw4w9WgXcQ";
const imageUrl = "https://cdn.discordapp.com/attachments/1109879223658749974/1134950535515095050/Screenshot_2023-07-29_at_17.47.42.png";
/**
 * Constants variables
 */
const cst = {
  // Dashboard button config
  button: {
    play: "<:w_play:1106270709644271656>",
    pause: "<:w_pause:1106270708243386428>",
    skip: "<:w_skip:1106270714664849448>",
    back: "<:w_back:1106270704049061928>",
    stop: "<:w_stop:1106272001909346386>",
    loop: "<:w_loop:1106270705575792681>",
    shuffle: "<:w_shuffle:1106270712542531624>",
  },
  // Default config
  config: {
    name: "Music Disc",
    prefix: "+",
    playing: "Sexo 2",
    defaultVolume: 50,
    maxVolume: 100,
    autoLeave: true,
    autoLeaveCooldown: 5000,
    displayVoiceState: true,
    port: 33333,
    urlQuery: QueryType.AUTO,
    textQuery: QueryType.AUTO,
  },
  ytdlOptions: {
    filter: "audioonly",
    quality: "highestaudio",
    // highWaterMark: //1 << 27,
  },
  color: {
    white: "\x1B[0m",
    grey: "\x1B[2m",
    green: "\x1B[32m",
    cyan: "\x1B[36m",
  },
  verifyBeforePlay: ["plucks78", RABELAO],
  allowedToBanSongs: ["plucks78"],
  blockedUsers: ["plucks77", RABELAO],
  blockedCommands: [
    "skip",
    "leave",
    "stop",
    "pause",
    "Playing-Skip",
    "Playing-PlayPause",
    "Playing-Stop",
  ],
  meMama: "❌ | Me mama hahaha 😁",
  rickRoll: {
    requestedBy: 'Plucks 😎',
    queryType: 'youtubeSearch',
    raw: null,
    extractor: null,
    id: '1130457187483652131',
    title: "Me mama",
    author: 'Plucks 😎',
    url: randomGemido,
    thumbnail: imageUrl,
    duration: '69:420',
    views: 46999513,
    playlist: undefined
  }
};

module.exports = cst;
