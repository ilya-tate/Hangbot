module.exports = {
  name: 'help',
  description: 'Lists commands',
  execute(message, arguments) {
    message.channel.send('\`\`\`DEFAULT PREFIX: "#"\nhelp - List commands\nping - Pings bot\nhangman - Plays hangman, type your guess after the game begins\ninvite - Shows invite for bot\`\`\`');
  }
}