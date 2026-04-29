const { DataTypes } = require('sequelize');
const sequelize = require('../dbserver.js');
const Door = require('./Door.js');

const DoorVariant = sequelize.define('DoorVariant', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    doorId: { 
        type: DataTypes.INTEGER, 
        defaultValue: 1, 
        references: { model: Door, key: 'id' }
    },
    size: DataTypes.STRING,
    color: DataTypes.STRING,
    openingSide: DataTypes.STRING,
    extraCharge: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
});

module.exports = DoorVariant;