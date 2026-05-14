const { DataTypes } = require('sequelize');
const sequelize = require('../dbserver.js');
const Customer = require('./Customer.js');
const DoorVariant = require('./DoorVariant.js');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    totalPrice: DataTypes.DECIMAL(10, 2),
    status: { type: DataTypes.STRING, defaultValue: 'Новый' },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false 
    }
});

Order.belongsTo(Customer, { foreignKey: 'customerId' });
Order.belongsTo(DoorVariant, { foreignKey: 'variantId' });

module.exports = Order;