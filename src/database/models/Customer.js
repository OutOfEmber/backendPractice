const { DataTypes } = require('sequelize');
const sequelize = require('../dbserver.js');

const Customer = sequelize.define('Customer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    phone: DataTypes.STRING
});

module.exports = Customer;