const os = require("os");
const Discord = require("discord.js");

const package = require(`${__dirname}/../../package.json`);
const {
  getOSVersion,
} = require(`${__dirname}/../utils/functions/getOSVersion`);
const { color } = require(`${__dirname}/../utils/constants`);

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.sqlite");

module.exports = async (client) => {
  client.status = {
    uptime: new Date(),
    os_version: await getOSVersion(),
    node_version: process.version,
    discord_version: `v${Discord.version}`,
    bot_version: `v${package.version}`,
    cpu: `${os.cpus()[0].model}`,
  };

  const release = {
    bot: `${client.config.name}: ${color.cyan}${client.status.bot_version}${color.white}`,
    nodejs: `Node.js: ${color.cyan}${client.status.node_version}${color.white}`,
    djs: `Discord.js: ${color.cyan}${client.status.discord_version}${color.white}`,
  };

  db.serialize(() => {
    const query =
      "SELECT name FROM sqlite_master WHERE type='table' AND name='ban'";

    db.all(query, [], (err, rows) => {
      if (rows.length == 0)
        db.run("CREATE TABLE ban (link TEXT, username TEXT)");
    });
  });

  db.close();

  console.log(`+-----------------------+`);
  console.log(`| ${release.bot.padEnd(30, " ")} |`);
  console.log(`| ${release.nodejs.padEnd(30, " ")} |`);
  console.log(`| ${release.djs.padEnd(30, " ")} |`);
  console.log(`+-----------------------+`);

  client.application.commands.set(
    client.commands.map((cmd) => {
      return {
        name: cmd.name,
        description: cmd.description,
        options: cmd.options,
      };
    })
  );

  client.user.setActivity(client.config.playing);
  console.log(`>>> Logged in as ${client.user.username}`);
};
