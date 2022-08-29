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
				.setRequired(true))
		.addStringOption(o =>
			o.setName('comment')
				.setDescription('Комментарий')
				.setRequired(false)),
	access: [],
	async execute(client, i) {
		const args = {
			user: i.options.getUser('user'),
			points: i.options.getInteger('points'),
			comment: i.options.getString('comment') ?? '',
		};

		const dbUser = await Users.findOneUser({ id: args.user.id });

		const transaction = await Transactions.create({
			type: 'IN',
			user: args.user.id,
			points: args.points,
			comment: args.comment
		});
		
		dbUser.points += args.points;
		await dbUser.save();

		const embed = new MessageEmbed()
			.setColor('#3889C4')
			.setAuthor({ name: `${i.user.username} | ID: ${transaction.id}`, iconURL: i.user.displayAvatarURL() })
			.setDescription(`**${args.points > 0 ? 'Добавил' : 'Отнял у'} <@${args.user.id}> \`${Math.abs(args.points)}\` поинтов!**${args.comment ? `\n\n**Комментарий:** \`${args.comment}\`` : ''}`);

		await i.reply({ embeds: [embed] });
	},
};