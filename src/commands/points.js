const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { Users } = require('./../db/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('points')
		.setDescription('Посмотреть количество поинтов пользователя')
		.addUserOption(o =>
			o.setName('user')
				.setDescription('Пользователь')
				.setRequired(false)),
	async execute(client, i) {
		const user = i.options.getUser('user') ?? i.user;
		const dbUser = await Users.findOneUser({ id: user.id });

		const embed = new MessageEmbed()
			.setColor('#3889C4')
			.setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
			.setDescription(`Имеет ${dbUser.points} поинтов!`) 
	
		i.reply({ embeds: [embed] });
	},
};