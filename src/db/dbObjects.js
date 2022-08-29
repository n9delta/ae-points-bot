const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('./models/Users.js')(sequelize, Sequelize.DataTypes);
const Transactions = require('./models/Transactions.js')(sequelize, Sequelize.DataTypes);

Reflect.defineProperty(Users, 'findOneUser', {
	value: async function (parameters) {
		let user = await Users.findOne({ where: parameters });
		if (!user) user = Users.create({ id: parameters.id, points: 0 });

		return user;
	},
});

module.exports = { Users, Transactions }