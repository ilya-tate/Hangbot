const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');

const client = new Discord.Client(); // Bot

// Command handling
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// On bot start
client.on('ready', () => {
  console.log(`Started Bot: ${client.user.username} ${client.user.id}`);
  client.user.setActivity(config.status);
});

// On guild join
client.on('guildCreate', guild => {
  console.log(`Joined Guild: ${guild.name} ${guild.id}`);
});

client.on('guildDelete', guild => {
  console.log(`Left Guild: ${guild.name} ${guild.id}`);
});

client.on('message', async message => {
  if (message.author.bot || !message.content.startsWith(config.prefix)) return; // If message from bot or !has prefix at start

  const arguments = message.content.slice(config.prefix.length).trim().split(/ +/); // Stuff after first part
  const command = arguments.shift().toLowerCase(); // First part of string input

  console.log(`${message.author.username} ${message.author.id}: ${command} ${arguments}`);

  // If command does not exist
  if (!fs.existsSync(`./commands/${command}.js`)) {
    return message.channel.send(`"${command}" is an invalid command`);
  }

  // Command must be same as file name
  client.commands.get(command).execute(message, arguments);
});

client.login(config.token); // Keep as last line