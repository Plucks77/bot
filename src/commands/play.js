const { isValidUrl } = require("../utils/functions/isValidUrl");
const {
  color,
  button,
  blockedUsers,
  blockedCommands,
  meMama,
  allowedToBanSongs,
  RABELAO,
  verifyBeforePlay,
} = require(`${__dirname}/../utils/constants`);

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.sqlite");

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Enter your song link or song name to play",
  usage: "play <URL/song name>",
  voiceChannel: true,
  options: [
    {
      name: "search",
      description: "The song link or song name",
      type: 3,
      required: true,
    },
  ],

  async execute(client, message, args) {
    if (!args[0])
      return message.reply({
        content: "❌ | Write the name of the music you want to search.",
        allowedMentions: { repliedUser: false },
      });

    const str = args.join(" ");
    let queryType = "";

    if (isValidUrl(str)) queryType = client.config.urlQuery;
    else queryType = client.config.textQuery;

    const results = await client.player
      .search(str, {
        requestedBy: message.member,
        searchEngine: queryType,
      })
      .catch((error) => {
        console.log(error);
        return message.reply({
          content:
            "❌ | The service is experiencing some problems, please try again.",
          allowedMentions: { repliedUser: false },
        });
      });

    if (!results || !results.hasTracks())
      return message.reply({
        content: "❌ | No results found.",
        allowedMentions: { repliedUser: false },
      });

    /*
        const queue = await client.player.play(message.member.voice.channel.id, results, {
            nodeOptions: {
                metadata: {
                    channel: message.channel,
                    client: message.guild.members.me,
                    requestedBy: message.user
                },
                selfDeaf: true,
                leaveOnEmpty: client.config.autoLeave,
                leaveOnEnd: client.config.autoLeave,
                leaveOnEmptyCooldown: client.config.autoLeaveCooldown,
                leaveOnEndCooldown: client.config.autoLeaveCooldown,
                volume: client.config.defaultVolume,
            }
        }); // The two play methods are the same
        */
    const queue = await client.player.nodes.create(message.guild, {
      metadata: {
        channel: message.channel,
        client: message.guild.members.me,
        requestedBy: message.user,
      },
      selfDeaf: true,
      leaveOnEmpty: client.config.autoLeave,
      leaveOnEnd: client.config.autoLeave,
      leaveOnEmptyCooldown: client.config.autoLeaveCooldown,
      leaveOnEndCooldown: client.config.autoLeaveCooldown,
      skipOnNoStream: true,
      volume: client.config.defaultVolume,
      connectionTimeout: 999_999_999,
    });

    try {
      if (!queue.connection) await queue.connect(message.member.voice.channel);
    } catch (error) {
      console.log(error);
      if (!queue?.deleted) queue?.delete();
      return message.reply({
        content: "❌ | I can't join audio channel.",
        allowedMentions: { repliedUser: false },
      });
    }

    results.playlist
      ? queue.addTrack(results.tracks)
      : queue.addTrack(results.tracks[0]);

    if (!queue.isPlaying()) {
      await queue.node.play().catch((error) => {
        console.log(error);
        return message.reply({
          content: "❌ | I can't play this track.",
          allowedMentions: { repliedUser: false },
        });
      });
    }

    return message.react("👍");
  },

  verify(username, str, interaction) {
    console.log("USERNAME NA PORRA DO VERIFY", username);

    if (verifyBeforePlay.includes(username)) {
      console.log("ENTROU NO IF DO VERIFY");

      db.serialize(() => {
        const query = "SELECT * FROM ban";

        // const all = db.all("SELECT * FROM ban");
        db.all(query, [], (err, rows) => {
          if (err) {
            console.error(err);
          } else {
            const found = rows.find((row) => row.link === str);
            if (found) {
              return false;
              return interaction.reply({
                content: "❌ | SE FODEU RABELAO KKKKKKKK ME MAMA 🤡🔪 🤠",
                allowedMentions: { repliedUser: false },
              });
            }
            console.log("FOUND", found);
            console.log("ROW", rows);
          }
        });
      });
      console.log("FORA DO SERIALIZE");
      // return true;
    }
    return true;
  },

  checkIfLinkExists(str) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM ban";
      db.serialize(() => {
        db.all(query, [], (err, rows) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            const found = rows.find((row) => row.link === str);
            if (found) {
              resolve(false);
            } else {
              resolve(true);
            }
          }
        });
      });
    });
  },

  async slashExecute(client, interaction) {
    const str = interaction.options.getString("search");
    let queryType = "";

    if (isValidUrl(str)) queryType = client.config.urlQuery;
    else queryType = client.config.textQuery;

    const should_play = await this.checkIfLinkExists(str)
      .then((result) => result)
      .catch((error) => {
        console.error(error);
      });

    console.log("SHOULD PLAY", should_play);

    if (should_play == false) {
      return interaction.reply({
        content: "❌ | SE FODEU RABELAO KKKKKKKK ME MAMA 🤡🔪 🤠",
        allowedMentions: { repliedUser: false },
      });
    }

    const results = await client.player
      .search(str, {
        requestedBy: interaction.member,
        searchEngine: queryType,
      })
      .catch((error) => {
        console.log(error);
        return interaction.reply({
          content:
            "❌ | The service is experiencing some problems, please try again.",
          allowedMentions: { repliedUser: false },
        });
      });

    if (!results || !results.tracks.length)
      return interaction.reply({
        content: "❌ | No results found.",
        allowedMentions: { repliedUser: false },
      });

    const queue = await client.player.nodes.create(interaction.guild, {
      metadata: {
        channel: interaction.channel,
        client: interaction.guild.members.me,
        requestedBy: interaction.user,
      },
      selfDeaf: true,
      leaveOnEmpty: client.config.autoLeave,
      leaveOnEnd: client.config.autoLeave,
      leaveOnEmptyCooldown: client.config.autoLeaveCooldown,
      leaveOnEndCooldown: client.config.autoLeaveCooldown,
      skipOnNoStream: true,
      volume: client.config.defaultVolume,
      connectionTimeout: 999_999_999,
    });

    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch (error) {
      console.log(error);
      if (!queue?.deleted) queue?.delete();
      return interaction.reply({
        content: "❌ | I can't join audio channel.",
        allowedMentions: { repliedUser: false },
      });
    }

    results.playlist
      ? queue.addTrack(results.tracks)
      : queue.addTrack(results.tracks[0]);

    if (!queue.isPlaying()) {
      await queue.node.play().catch((error) => {
        console.log(error);
        return interaction.reply({
          content: "❌ | I can't play this track.",
          allowedMentions: { repliedUser: false },
        });
      });
    }

    return interaction.reply("✅ | Music added.");
  },
};
