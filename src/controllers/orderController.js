const Order = require('../database/models/Order.js');
exports.getAll = async (req, res) => {
    try {
        const data = await Order.findAll();
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};
exports.getOne = async (req, res) => {
    try {
        const data = await Order.findByPk(req.params.id);
        if (!data) return res.status(404).json({ success: false, message: "Не найдено" });
        res.json({ success: true, data });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};
exports.create = async (req, res) => {
    try {
        const newItem = await Order.create(req.body);
        res.status(201).json({ success: true, data: newItem });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};
exports.update = async (req, res) => {
    try {
        const item = await Order.findByPk(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Не найдено" });
        await item.update(req.body);
        res.json({ success: true, data: item });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};
exports.delete = async (req, res) => {
    try {
        const item = await Order.findByPk(req.params.id);
        if (!item) return res.status(404).json({ success: false, message: "Не найдено" });
        await item.destroy();
        res.json({ success: true, message: "Удалено" });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};