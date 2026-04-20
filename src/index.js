const express = require('express');
const sequelize = require('./database/dbserver');

const Door = require('./database/models/Door');
const DoorVariant = require('./database/models/DoorVariant');
const Storage = require('./database/models/Storage');
const Store = require('./database/models/Store');
const Stock = require('./database/models/Stock');

const app = express();
app.use(express.json());

Door.hasMany(DoorVariant, { foreignKey: 'doorId' });
DoorVariant.belongsTo(Door, { foreignKey: 'doorId' });

Door.hasMany(Storage, { foreignKey: 'productId' }); 
Storage.belongsTo(Door, { foreignKey: 'productId' });

Storage.hasMany(Stock, { foreignKey: 'storageId' });
Stock.belongsTo(Storage, { foreignKey: 'storageId' });

app.use('/doors', doorRouter);
app.use('/orders', orderRouter);

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: false }); 
        console.log("База данных успешно синхронизирована");

        app.listen(3000, () => console.log('Сервер запущен на порта 3000'));
    } catch (e) {
        console.error("Ошибка запуска:", e.message);
    }
}

start();
