const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'hangman',
  description: 'Plays hangmang',
  execute(message, arguments) {
    const { prefix, phrases } = require('../config.json');
    const currentPhrase = (phrases[Math.floor(Math.random() * phrases.length)]).toLowerCase();

    // Replaces characters with spaces
    let currentPhraseBlanks = currentPhrase.split(/ +/);
    for (word in currentPhraseBlanks) {
      currentPhraseBlanks[word] = currentPhraseBlanks[word].split('')
      for (char in currentPhraseBlanks[word]) {
        currentPhraseBlanks[word][char] = '_';
      }
    }

    let usedLetters = '';

    // Makes displayPhraseBlanks the phrase but with blanks for each nonspace char
    let displayPhraseBlanks = [];
    for (word in currentPhraseBlanks) {
      displayPhraseBlanks.push(currentPhraseBlanks[word].join(''));
    }
    displayPhraseBlanks = displayPhraseBlanks.join(' ');

    // The first embed for starting game

    let currentImage = 0;
    let botMsg = message
    async function sendEmbed(){
      botMsg.delete()
      botMsg = await message.channel.send(new Discord.MessageEmbed()
      .setTitle(`${message.author.username}'s Hangman`)
      .setDescription(`\`\`\`Current Word: ${displayPhraseBlanks}\nIncorrect Characters: ${usedLetters}\`\`\`\n"stop-hangman" to stop game`)
      .attachFiles(`./assets/hangman${currentImage}.png`)
      .setImage(`attachment://hangman${currentImage}.png`));
    }

    sendEmbed();
    
    const collector = new Discord.MessageCollector(message.channel, messageTemp => messageTemp.author.id === message.author.id);

    // Collecter with stuff for responses to first embed and after
    collector.on('collect', message => {
      if (message.author.bot) return;

      if (message.content === 'stop-hangman') {
        // Stops gmae
        message.channel.send('Stopping game');
        collector.stop();

      } else if (message.content.length !== 1) {
        // Must have one char
        message.channel.send('Please enter only one character');

      } else if (!currentPhrase.includes(message.content)) {
        // Does the image for how many tries left or if you lose it stops
        currentImage++;
        if (usedLetters !== '') {
          usedLetters += `, ${message.content}`;
        } else {
          usedLetters += message.content
        }
        

        if (currentImage == 6) {
          message.channel.send('You died');
          displayPhraseBlanks = currentPhrase;
          sendEmbed()
          collector.stop();

        } else {
          sendEmbed()
        }

      } else if(displayPhraseBlanks.includes(message.content) || usedLetters.includes(message.content)) {
        // If char is already unblanked out
        message.channel.send('Character already registered');

      } else {
        // Turns found char from blank to correct char
        for (i in currentPhrase.split('')) {
          if (message.content === currentPhrase.split('')[i]) {
            displayPhraseBlanks = displayPhraseBlanks.split('');
            displayPhraseBlanks[i] = message.content;
            displayPhraseBlanks = displayPhraseBlanks.join('');
          }
        }

        // Embed of new str with correct char positions replaced from blanks
        sendEmbed()

        if (!displayPhraseBlanks.includes('_')) {
          message.channel.send('You win');
          collector.stop();
        }
      }
    });
  }
}