const { DataTypes } = require('sequelize');
const sequelize = require('../dbserver.js');

const DoorVariant = sequelize.define('DoorVariant', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    doorId: { 
        type: DataTypes.INTEGER, 
        defaultValue: 1
    },
    size: DataTypes.STRING,
    color: DataTypes.STRING,
    openingSide: DataTypes.STRING,
    extraCharge: { 
        type: DataTypes.INTEGER, 
        defaultValue: 0 
    }
}, {
    tableName: 'DoorVariants', 
    modelName: 'DoorVariant',
    timestamps: true
});

module.exports = DoorVariant;