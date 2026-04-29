const { DataTypes } = require('sequelize');
const sequelize = require('../dbserver.js');

const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING
});

module.exports = Employee;