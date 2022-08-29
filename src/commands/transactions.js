const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const { Transactions } = require('./../db/dbObjects.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transactions')
		.setDescription('Получение информации о транкзакциях')
		.addSubcommand(sb =>
			sb.setName('get')
				.setDescription('Получить последние транкзакции')
				.addIntegerOption(o =>
					o.setName('amount')
						.setDescription('Количество транкзакций')
						.setRequired(true)))
		.addSubcommand(sb =>
			sb.setName('info')
				.setDescription('Посмотреть информацию об одной транкзакции')
				.addIntegerOption(o =>
					o.setName('id')
						.setDescription('Айди транкзакции')
						.setRequired(true))),
	async execute(client, i) {
		if (i.options.getSubcommand() == 'get') {
			const transactions = await Transactions.findAll({});

			const args = {
				amount: i.options.getInteger('amount') > transactions.length ? transactions.length : i.options.getInteger('amount'),
			};

			if (args.amount <= 0) {
				const embed = new MessageEmbed()
					.setColor('#D0021B')
					.setDescription(`🔴 **Недопустимое количество транкзакций!**`);
		
				return await i.reply({ embeds: [embed] });
			}

			let embeds = [];
			for (const [j, trans] of transactions.entries()) {
				const user = await client.users.fetch(trans.user);

				const embed = new MessageEmbed()
					.setColor('#3889C4')
					.setAuthor({ name: `${user.username} | ID: ${trans.id}`, iconURL: user.displayAvatarURL() })
					.setDescription(`**${trans.points > 0 ? 'Добавил' : 'Отнял у'} <@${trans.target}> \`${Math.abs(trans.points)}\` поинтов!**${trans.comment ? `\n\n**Комментарий:** \`${trans.comment}\`` : ''}`);
			
				embeds.push(embed);

				if (j % 10 == 9 || (args.amount < 10 && j == args.amount-1)) {
					j < 10 ? await i.reply({ embeds: embeds }) : await i.followUp({ embeds: embeds });
					embeds = [];
				}
			}
		}

		if (i.options.getSubcommand() == 'info') {
			const args = {
				id: i.options.getInteger('id')
			};

			const trans = await Transactions.findOne({ where: { id: args.id } });

			if (trans) {
				const user = await client.users.fetch(trans.user);

				const embed = new MessageEmbed()
					.setColor('#3889C4')
					.setAuthor({ name: `${user.username} | ID: ${trans.id}`, iconURL: user.displayAvatarURL() })
					.setDescription(`**${trans.points > 0 ? 'Добавил' : 'Отнял у'} <@${trans.target}> \`${Math.abs(trans.points)}\` поинтов!**${trans.comment ? `\n\n**Комментарий:** \`${trans.comment}\`` : ''}`);
			
		
				return await i.reply({ embeds: [embed] });
			}

			const embed = new MessageEmbed()
					.setColor('#D0021B')
					.setDescription(`🔴 **Транкзакции с таким айди не существует!**`);
		
			await i.reply({ embeds: [embed] });
		}		
	},
};