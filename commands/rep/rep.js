const fs = require('fs');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { green } = require('../../colors.json');
const repStore = './rep.json';

let rep = {};

function loadRep() {
    try {
        rep = JSON.parse(fs.readFileSync(repStore, 'utf8'));
    } catch (error) {
        console.error('An error occurred while loading rep:', error);
    }
}

loadRep();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rep')
		.setDMPermission(false)
		.setDescription('Give rep to another user.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => option.setName('user').setDescription('The user to give rep to.').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('The reason for giving rep.')),
	async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user);
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        if (!member) {
            return await interaction.reply('The user you are trying to give rep to is not in this server.');
        }
        if (member.id === interaction.user.id) {
            return await interaction.reply('You cannot give rep to yourself.');
        }

        const userId = user.id;
        if (!rep[userId]) {
            rep[userId] = 0;
        }

        rep[userId]++;
        fs.writeFileSync(repStore, JSON.stringify(rep, null, 4), 'utf8');

		const reply = new EmbedBuilder()
		.setTitle('Server Info')
		.setDescription(`You have given rep to **${member.user.tag}**. They now have **${rep[userId]}** rep.`)
		.setTimestamp()
        .setColor(green)
		.setThumbnail(interaction.guild.iconURL());
		await interaction.reply({ embeds: [reply], ephemeral: true });

        const repChannel = interaction.client.channels.cache.get('1261480051602362491') || interaction.guild.channels.cache.find(channel => channel.name === 'rep');
        if (!repChannel) {
            return;
        }
        const repEmbed = new EmbedBuilder()
            .setTitle('Rep Given')
            .setDescription(`**${interaction.user.tag}** has given rep to **${member.user.tag}**.\nThey now have **${rep[userId]}** rep.\n\n**Reason:** ${reason}`)
            .setTimestamp()
            .setColor(green)
            .setThumbnail(user.avatarURL());
        await repChannel.send({ content: `${member}`, embeds: [repEmbed] });
	},
};