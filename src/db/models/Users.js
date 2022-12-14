module.exports = (sequelize, DataTypes) => {
	return sequelize.define('Users', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		points: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			allowNull: false,
		},
	}, {
		timestamps: false,
	});
};