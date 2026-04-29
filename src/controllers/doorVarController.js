const DoorVariant = require('../database/models/DoorVariant.js');

exports.getAll = async (req, res) => {
  try {
    const data = await DoorVariant.findAll();
    res.json({ success: true, data, count: data.length });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const item = await DoorVariant.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Вариант двери не найден' });
    res.json({ success: true, data: item });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const newItem = await DoorVariant.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const item = await DoorVariant.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Вариант двери не найден' });
    await item.update(req.body);
    res.json({ success: true, message: 'Данные обновлены', data: item });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};

exports.delete = async (req, res) => {
  try {
    const item = await DoorVariant.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Вариант двери не найден' });
    await item.destroy();
    res.json({ success: true, message: 'Вариант удален' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};