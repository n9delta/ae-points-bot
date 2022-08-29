require('dotenv').config()
const fs = require('node:fs');
const path = require('node:path');

const { Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"] });

const { Op } = require('sequelize');
const { Users } = require('./db/dbObjects.js');

// Считывание всех файлов комманд и добавление в коллецию
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// Обработчик неизвестных ошибок
process.on("uncaughtException", (e) => {
    console.error(e);
});

client.once('ready', async () => {
	console.log( `USER | Ready as ${client.user.username}!`);

	let reloadState = fs.readFileSync( path.join(__dirname, './helpers/reloadState.json'),
		{ encoding: 'utf-8' }
	);
	reloadState = JSON.parse(reloadState);

	if (reloadState && !reloadState?.answered) {
		const message = await client.channels.cache.get(reloadState.channelId).messages.fetch(reloadState.messageId);

		const embed = new MessageEmbed()
			.setColor('#4BBD5C')
			.setDescription('🟢 **Бот успешно перезагружен!**');
		await message.edit({ embeds: [embed] });

		fs.writeFileSync( path.join(__dirname, './helpers/reloadState.json'),
			JSON.stringify({ channelId: reloadState.channelId, messageId: reloadState.messageId, answered: true }),
			{ encoding: 'utf-8' }
		);
	}
});

/*
* Обработчик взаимодействий
*/ 
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	if (!(command.access?.includes(interaction.user.id) || process.env.ADMINS.split(',').includes(interaction.user.id))) {
		let embed = new MessageEmbed()
			.setColor('#D0021B')
			.setDescription('У вас нет прав на выполнение этой команды');

		return interaction.reply({ embeds: [embed], ephemeral: true });
	}

	try {
		await command.execute(client, interaction, Users);
	} catch (error) {
		console.error(error);
		
		let embed = new MessageEmbed()
			.setColor('#D0021B')
			.setDescription('Неизвестная ошибка при выполнение этой команды! Свяжитесь с администратором');

		await interaction.reply({ embeds: [embed], ephemeral: true });
	}
});

/*
* Обработчик сообщений
*/ 
client.on('messageCreate', async (msg) => {
	/*
	* [DEPRECATED]
	*/
	// Проверка начинает ли с префикса сообщение
	const prefix = 'e9';
	if (!msg.content.startsWith(prefix)) return;

	const args = msg.content.trim().split(/ +/g);
	const cmd = args[0].slice(prefix.length).toLowerCase();

	if (cmd === 'ping') {
		msg.channel.send('pong');
	} 
});

// Залогиниться с токеном
client.login(process.env.TOKEN);