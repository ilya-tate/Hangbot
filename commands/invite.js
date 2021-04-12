const { botInviteLink } = require('../config.json');

module.exports = {
  name: 'invite',
  description: 'Creates invite link for bot',
  execute(message, arguments) {
    message.channel.send(botInviteLink);
  }
}