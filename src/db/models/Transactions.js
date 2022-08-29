module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Transactions', {
		type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		comment: DataTypes.STRING,
		points: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};