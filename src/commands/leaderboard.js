const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const { Users } = require('./../db/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Просмотр топа пользователей по поинтам'),
	async execute(client, i) {
		let users = await Users.findAll({});

		users.sort(function (a, b) {
			return b.points - a.points
		});

		users = await Promise.all(
			users.map(async function (el, i) {
				return `**${i+1}.** ${(await client.users.fetch(el.id)).username} - ${el.points}`
			})
		);

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('swipeLeft')
					.setStyle('SECONDARY')
					.setEmoji('◀️'),
				new MessageButton()
					.setCustomId('home')
					.setStyle('SECONDARY')
					.setEmoji('🏠'),
				new MessageButton()
					.setCustomId('swipeRight')
					.setStyle('SECONDARY')
					.setEmoji('▶️'),
			);

		let page = 0;

		let leaderboard = [];
		for (let i = 0; i < 10; i++) {
			leaderboard.push(users[i]);
		}

		const embed = new MessageEmbed()
			.setColor('#3889C4')
			.setDescription(leaderboard.join('\n'));

		const message = await i.reply({ embeds: [embed], components: [row], fetchReply: true });

		const filter = (b) => b.user.id == i.user.id && b.message.id == message.id;
		const collector = message.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 600000 });

		collector.on('collect', async function (b) {
			leaderboard = [];

			if (b.customId == 'swipeLeft') {
				page = page-1 < 0 ? Math.ceil(users.length/10)-1 : page-1;
			}
		
			if (b.customId == 'swipeRight') {
				page = page+1 > Math.ceil(users.length/10)-1 ? 0 : page+1;
			}

			if (b.customId == 'home') {
				page = 0;
			}

			for (let i = 1 * (page * 10); i < 10 + (page * 10); i++) {
				leaderboard.push(users[i]);
			}

			embed.setDescription(leaderboard.join('\n'));

			await b.deferUpdate(); await b.editReply({ embeds: [embed] });
		});
	},
};