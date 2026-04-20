const { DataTypes } = require('sequelize');
const sequelize = require('../dbserver');

const DoorVariant = sequelize.define('DoorVariant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    doorId: { type: DataTypes.INTEGER },
    size: DataTypes.STRING,
    color: DataTypes.STRING,
    openingSide: DataTypes.STRING,
    extraCharge: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
});

module.exports = DoorVariant;