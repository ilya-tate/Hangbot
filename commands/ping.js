module.exports = {
  name: 'ping',
  description: 'Pings bot',
  execute(message, arguments) {
    message.channel.send('Pong');
  }
}