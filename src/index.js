const express = require('express');
const sequelize = require('./database/dbserver.js'); 
const cors=require('cors')

const Door = require('./database/models/Door.js');
const DoorVariant = require('./database/models/DoorVariant.js');
const Storage = require('./database/models/Storage.js');
const Store = require('./database/models/Store.js');
const Order = require('./database/models/Order.js');
const Customer = require('./database/models/Customer.js');

const customerRouter = require('./routes/customerRouter.js');
const doorVarRouter = require('./routes/doorVarRouter.js');
const storageRouter = require('./routes/storageRouter.js');
const storeRouter = require('./routes/storeRouter.js');
const orderRouter = require('./routes/orderRouter.js');
const doorRouter = require('./routes/doorRouter.js');
const authRouter = require('./routes/authRouter.js');

const app = express();
app.use(cors())
app.use(express.json());

Door.hasMany(DoorVariant, { foreignKey: 'doorId' });
DoorVariant.belongsTo(Door, { foreignKey: 'doorId' });

Door.hasMany(Storage, { foreignKey: 'productId' }); 
Storage.belongsTo(Door, { foreignKey: 'productId' });

app.use('/doors', doorRouter); 
app.use('/orders', orderRouter);
app.use('/customers', customerRouter);
app.use('/variants', doorVarRouter);
app.use('/storage', storageRouter);
app.use('/stores', storeRouter);
app.use('/api/auth', authRouter);

async function checkInitDB() {
    try {
        await sequelize.authenticate();
        console.log('Соединение с базой данных успешно установлено.');
    } catch (e) {
        console.error('Невозможно подключиться к базе данных:', e);
        process.exit(1);
    }
}
async function start() {
    try {
        await checkInitDB();
        await sequelize.sync({ force: false }); 
        console.log("База данных успешно синхронизирована");
        app.listen(3000, () => console.log('Сервер запущен на порте 3000'));
    } catch (e) {
        console.error("Ошибка запуска:", e);
    }
}

start(); 