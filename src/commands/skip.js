const {
  blockedUsers,
  meMama,
} = require(`${__dirname}/../utils/constants`);

module.exports = {
  name: 'skip',
  aliases: ['s'],
  description: 'Skip currnet song',
  usage: 'skip',
  voiceChannel: true,
  options: [],

  async execute(client, message) {
    const queue = client.player.nodes.get(message.guild.id);
    const { username } = message.author;

    if (blockedUsers.includes(username)) return message.reply(meMama);

    if (!queue || !queue.isPlaying()) {
      return message.reply({
        content: '❌ | There is no music currently playing.',
        allowedMentions: { repliedUser: false },
      });
    }

    if (queue.repeatMode === 1) {
      queue.setRepeatMode(0);
      queue.node.skip();
      await wait(500);
      queue.setRepeatMode(1);
    } else {
      queue.node.skip();
    }

    return message.react('👍');
  },

  async slashExecute(client, interaction) {
    const queue = client.player.nodes.get(interaction.guild.id);
    const { username } = interaction.user;

    if (!blockedUsers.includes(username)) return interaction.reply({
      content: meMama,
      allowedMentions: { repliedUser: false },
    });

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: '❌ | There is no music currently playing.',
        allowedMentions: { repliedUser: false },
      });
    }

    if (queue.repeatMode === 1) {
      queue.setRepeatMode(0);
      queue.node.skip();
      await wait(500);
      queue.setRepeatMode(1);
    } else {
      queue.node.skip();
    }
    return interaction.reply('✅ | Music skipped.');
  },
};

const wait = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
