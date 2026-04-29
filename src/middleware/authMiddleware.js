const jwt = require('jsonwebtoken');
const SECRET_KEY = "SUPER_SECRET_KEY_123";

exports.authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Не авторизован" });

        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ message: "Не авторизован" });
    }
};
exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: "Нет доступа (только для админов)" });
    }
    next();
};