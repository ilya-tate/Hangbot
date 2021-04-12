module.exports = {
  name: 'invite',
  description: 'Creates invite link for bot',
  execute(message, arguments) {
    const { botInviteLink } = require('./config.json')

    message.channel.send(botInviteLink);
  }
}