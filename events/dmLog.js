const { Events, EmbedBuilder } = require('discord.js');
const { red } = require('../colors.json');
const config = require('../config.json');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        try {
            if (message.channel.isDMBased()) {
                const channelId = config.logChannel;
                const channel = message.client.channels.cache.get(channelId) || message.client.channels.cache.find(channel => channel.name === 'logs');
                if (!channel) {
                    return;
                }
                const logEmbed = new EmbedBuilder()
                    .setTitle(`${message.author.tag} sent a DM`)
                    .setDescription(`Message:\n ${message.content}`)
                    .setThumbnail(message.author.avatarURL())
                    .setColor(red)
                    .setTimestamp();
                await channel.send({ embeds: [logEmbed] });
            }
        } catch (error) {
            console.error('An error occurred while processing a DM message:', error);
        }
    }
};
