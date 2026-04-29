const User = require('../database/models/User.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "SUPER_SECRET_KEY_123";

exports.registration = async (req, res) => {
    try {
        const { login, password, role } = req.body;
        const candidate = await User.findOne({ where: { login } });
        if (candidate) return res.status(400).json({ message: "Пользователь уже существует" });

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({ login, password: hashPassword, role });
        
        res.json({ message: "Пользователь зарегистрирован" });
    } catch (e) { res.status(500).json({ message: e.message }); }
};

exports.login = async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await User.findOne({ where: { login } });
        if (!user) return res.status(400).json({ message: "Пользователь не найден" });

        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) return res.status(400).json({ message: "Неверный пароль" });

        const token = jwt.sign({ id: user.id, login: user.login, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token });
    } catch (e) { res.status(500).json({ message: e.message }); }
};