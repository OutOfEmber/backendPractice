const { DataTypes } = require('sequelize');
const sequelize = require('../dbserver.js');
const Door = require('./Door.js');

const Storage = sequelize.define('Storage', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    productId: { 
        type: DataTypes.INTEGER, 
        defaultValue: 1, 
        references: { model: Door, key: 'id' }
    },
    storageName: DataTypes.STRING, 
});

module.exports = Storage;