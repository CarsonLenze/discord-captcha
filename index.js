const chalk = require('chalk')
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

class Captcha {
  constructor(client, options) {
    this.client = client;
    this.options = options;

    require('discord-buttons')(client);

    client.on('ready', async () => {

      const error = chalk.bold.red;
      const warning = chalk.keyword('orange');

      if (!options.channelID) return console.log(error('Error'), `You did not provide a channel ID!`)

      if (!options.roleID) return console.log(error('Error'), `You did not provide a role ID!`)

      const Channel = client.channels.cache.find(channel => channel.id === options.channelID)

      if (!Channel) return console.log(warning('Warning'), `The channel ${options.channelID} does not exist or I do not have perms to see it.`);

      const Role = Channel.guild.roles.cache.find(role => role.id === options.roleID);

      if (!Role) return console.log(warning('Warning'), `The role ${options.roleID} does not exist.`);

      const messages = await Channel.messages.fetch({ limit: 100 })

      if (1 < messages.size) return console.log(warning('Warning'), `There are messages in the channel. Please delete them before running.`);

      if (messages.first()) {
        if (!messages.first().author.bot) return console.log(warning('Warning'), `There are messages in the channel. Please delete them before running.`);
      } else {
        Channel.send('', {
          button: {
            "type": 2,
            "style": 1,
            "label": "Verify",
            "disabled": false,
            "custom_id": "Verify_Button"
          }, embed: {
            "title": "Verification",
            "type": "rich",
            "description": "Press Verify to gain access to the rest of the server!",
            "color": 39423,
          }
        }).catch(err => {
          console.log(error('Error'), `I can not send messages in the verifiecation channel!`)
        })
      }
      client.on('message', message => {
        if (message.channel.id === options.channelID) {
          if (message.author.bot) return;
          message.delete({ timeout: 250 })
        }
      })

      client.on('clickButton', async (button) => {

        if (button.id === 'Verify_Button') {

          let trys = 0

          async function captcha() {

            const response = await axios.default.get('https://api.no-api-key.com/api/v2/captcha');

              const Embed1 = new MessageEmbed()
              .setDescription('Verification failed! Please try again.')
	              .setImage(response.data.captcha);

            if (trys > 0) button.reply.edit({ embed: Embed1, content: null, ephemeral: true})

            const Embed = new MessageEmbed()
	              .setImage(response.data.captcha);

            if (trys == 0) await button.reply.send({ embed: Embed, content: null, ephemeral: true})

            const filter = m => m.author.id === button.clicker.member.id;

            const collecter = button.channel.createMessageCollector(filter, { max: 1 });

            collecter.on("end", (resp) => {

              resp.forEach((val) => {

                let ans = val.content === response.data.captcha_text ? true : false;

                if (ans == true) {

                  if (!button.clicker.member.manageable) {
                    console.log(warning('Warning'), `I do not have permission to give users the verified role.`)
                    return button.reply.edit(`I dont not have permission to give you <@&${options.roleID}>`, true)
                  }
                  button.clicker.member.roles.add(options.roleID).catch(err => { })
                  button.reply.edit(`You have been verified in ${button.guild.name}`, true)

                } else {

                  trys++
                  captcha()
                }
              })
            });
          }
          captcha()
        }
      })

    });

  }
}

module.exports = Captcha
