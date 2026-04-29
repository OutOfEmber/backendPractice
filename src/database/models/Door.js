const { DataTypes } = require('sequelize');
const sequelize = require('../dbserver.js');
const DoorVariant = require('./DoorVariant.js');

const Door = sequelize.define('Door', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    doorName: DataTypes.STRING,
    doorType: DataTypes.STRING,
    material: DataTypes.STRING,
    basePrice: DataTypes.DECIMAL(10, 2),
});

module.exports = Door;