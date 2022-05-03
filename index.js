import { Client, Intents } from 'discord.js';
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
import getTrends from './getTrends.js';
import dotenv from 'dotenv';
dotenv.config();

client.once('ready', () => {
  console.log('bot working okok');
  // getTrends();
})

client.on('messageCreate', message => {
  if (message.author.id == client.user.id) return false;
  if (message.content.startsWith("trendy")) {
    let keys = message.content.split(' ');
    let data;
    keys.shift();
    if (keys.length == 0) {
      keys = ['dziady', 'lalka', 'pan tadeusz', 'wesele'];
    } else if (keys.length > 5) {
      keys = [keys[0], keys[1], keys[2], keys[3], keys[4]]
    }
    getTrends(keys).then(results => {
      let resultsFields = [];
      for (let x = 0; x < results.keywords.length; x++) {
        resultsFields.push({
          name: `${results.keywords[x]}`,
          value: ` Średnia: \`${results.avg[x]}\` Minimalne: \`${results.min[x]}\` Maksymalne: \`${results.max[x]}\` Róznica: \`${results.diff[x]}\``,
        });
      }
      message.channel.send({embeds: [{
        color: 0xfafafa,
        title: `Wyniki dla ${keys}`,
        description: `Czestotliwosc wyszukiwania podanych fraz przez ostatnie 15 minut do teraz.`,
        fields: resultsFields,
        footer: {
          text: 'okko'
        }
      }]})
    }).catch(err => {
      console.error(err);
      message.react('❌')
    })
  }
})

client.login(process.env.DISCORDTOKEN);