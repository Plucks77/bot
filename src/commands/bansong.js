const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.sqlite");

const { allowedToBanSongs } = require(`${__dirname}/../utils/constants`);

module.exports = {
  name: "bansong",
  aliases: [],
  description: "Adiciona a música atual na lista de banidas",
  usage: "",
  voiceChannel: true,
  options: [
    {
      name: "link",
      description: "O link da música",
      type: 3,
      required: true,
    },
  ],

  // async execute(client, message) {
  //   console.log("O comando bansong foi executado.");

  //   db.each("SELECT * FROM ban", (err, row) => {
  //     console.log(row.id + ": " + row.info);
  //   });

  //   return await message.react("👍");
  // },

  async slashExecute(client, interaction) {
    // console.log("O comando bansong foi executado PORRAR.");

    const username = interaction.user.username;

    if (!allowedToBanSongs.includes(username)) {
      return await interaction.reply(
        "❌ | Para poder banir os chorumes do Rabelllenda, você precisa dar uma mamadinha no Plucks 😁."
      );
    }

    const link = interaction.options.getString("link");
    console.log("str", link);

    const stmt = db.prepare("INSERT INTO ban VALUES (?, ?)");
    stmt.run(link, username);

    stmt.finalize();

    db.each("SELECT * FROM ban", (err, row) => {
      console.log(row.link);
    });

    return await interaction.reply("✅ | Música banida.");
  },
};
