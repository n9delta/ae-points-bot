const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { Users, Transactions } = require('./../db/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Управление поинтами пользователя')
		.addUserOption(o =>
			o.setName('user')
				.setDescription('Пользователь')
				.setRequired(true))
		.addIntegerOption(o =>
			o.setName('points')
				.setDescription('Кол-во поинтов')
				.setRequired(true)),
	async execute(client, i) {
		const user = i.options.getUser('user');
		const dbUser = Users.findOneUser({ id: user.id });

		const points = i.options.getInteger('points');

		consle.log(dbUser.points, points);
	},
};