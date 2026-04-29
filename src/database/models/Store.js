const { DataTypes } = require('sequelize');
const sequelize = require('../dbserver.js');

const Store = sequelize.define('Store', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    storeName: DataTypes.STRING, 
});

module.exports = Store;