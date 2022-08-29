const fs = require('node:fs');
const path = require('node:path');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads the bot'),
	access: [],
	async execute(client, i) {
		const embed = new MessageEmbed()
			.setColor('#3889c4')
			.setDescription('🔄 **Перезагрузка бота...**');
		const message = await i.reply({ embeds: [embed], fetchReply: true });

		fs.writeFileSync(path.join(__dirname, './../helpers/reloadState.json'),
			JSON.stringify({ channelId: message.channel.id, messageId: message.id, answered: false }),
			{ encoding: 'utf-8' }
		);

		console.log(`DEV | Ручная перезагрузка бота от ${i.user.username} (${i.user.id})`);

		process.exit(0);
	},
};
