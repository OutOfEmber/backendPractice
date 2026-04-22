const express = require('express');
const sequelize = require('./database/dbserver.js'); 

const Door = require('./database/models/Door.js');
const DoorVariant = require('./database/models/DoorVariant.js');
const Storage = require('./database/models/Storage.js');
const Store = require('./database/models/Store.js');
const Order = require('./database/models/Order.js');
const Customer = require('./database/models/Customer.js');

const doorRouter = require('./routes/doorRouter.js');
const orderRouter = require('./routes/orderRouter.js');

const app = express();
app.use(express.json());

Door.hasMany(DoorVariant, { foreignKey: 'doorId' });
DoorVariant.belongsTo(Door, { foreignKey: 'doorId' });

Door.hasMany(Storage, { foreignKey: 'productId' }); 
Storage.belongsTo(Door, { foreignKey: 'productId' });

app.use('/doors', doorRouter); 
app.use('/orders', orderRouter);

async function start() {
    try {
        await sequelize.sync({ force: false }); 
        console.log("База данных успешно синхронизирована");
        app.listen(3000, () => console.log('Сервер запущен на порта 3000'));
    } catch (e) {
        console.error("Ошибка запуска:", e);
    }
}

start(); 