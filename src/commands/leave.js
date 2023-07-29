module.exports = {
  name: 'leave',
  aliases: ['stop'],
  description: 'Leave current voice channel',
  usage: 'leave',
  voiceChannel: true,
  options: [],

  execute(client, message) {
    const queue = client.player.nodes.get(message.guild.id);

    const { username } = interaction.user;
    if (username === 'oRabellenda') return interaction.reply('❌ | Suga a minha bola haha 😁');

    if (!queue || !queue.isPlaying()) {
      return message.reply({
        content: '❌ | There is no music currently playing.',
        allowedMentions: { repliedUser: false },
      });
    }

    if (!queue.deleted) queue.delete();

    return message.react('👍');
  },

  slashExecute(client, interaction) {
    const queue = client.player.nodes.get(interaction.guild.id);

    const { username } = interaction.user;
    if (username === 'oRabellenda') return interaction.reply('❌ | Suga a minha bola haha 😁');

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: '❌ | There is no music currently playing.',
        allowedMentions: { repliedUser: false },
      });
    }

    if (!queue.deleted) queue.delete();

    return interaction.reply('✅ | Bot leave.');
  },
};
