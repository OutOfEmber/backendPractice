const Order = require('../database/models/Order.js');

exports.getAll = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                success: false, 
                message: "Пользователь не найден в запросе. Проверьте Middleware." 
            });
        }

        const data = await Order.findAll({ where: { userId: req.user.id } });
        res.json({ success: true, data });
    } catch (e) { 
        res.status(500).json({ success: false, error: e.message }); 
    }
};
exports.getOne = async (req, res) => {
    try {
        const data = await Order.findOne({ 
            where: { id: req.params.id, userId: req.user.id } 
        });
        if (!data) return res.status(404).json({ success: false, message: "Заказ не найден или доступ запрещен" });
        res.json({ success: true, data });
    } catch (e) { 
        res.status(500).json({ success: false, error: e.message }); 
    }
};
exports.create = async (req, res) => {
    try {
        const newItem = await Order.create({
            ...req.body,
            userId: req.user.id 
        });
        res.status(201).json({ success: true, data: newItem });
    } catch (e) { 
        res.status(500).json({ success: false, error: e.message }); 
    }
};

exports.update = async (req, res) => {
    try {
        const item = await Order.findOne({ 
            where: { id: req.params.id, userId: req.user.id } 
        });
        if (!item) return res.status(404).json({ success: false, message: "Заказ не найден" });
        
        await item.update(req.body);
        res.json({ success: true, data: item });
    } catch (e) { 
        res.status(500).json({ success: false, error: e.message }); 
    }
};

exports.delete = async (req, res) => {
    try {
        const item = await Order.findOne({ 
            where: { id: req.params.id, userId: req.user.id } 
        });
        if (!item) return res.status(404).json({ success: false, message: "Заказ не найден" });
        
        await item.destroy();
        res.json({ success: true, message: "Заказ успешно отменен и удален" });
    } catch (e) {  
        res.status(500).json({ success: false, error: e.message }); 
    }
};