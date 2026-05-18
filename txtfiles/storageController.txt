const Storage = require('../database/models/Storage.js');

exports.getAll = async (req, res) => {
  try {
    const data = await Storage.findAll();
    res.json({ success: true, data, count: data.length });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const item = await Storage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Складская запись не найдена' });
    res.json({ success: true, data: item });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};

exports.create = async (req, res) => {
  try {
    const newItem = await Storage.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};

exports.update = async (req, res) => {
  try {
    const item = await Storage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Запись не найдена' });
    await item.update(req.body);
    res.json({ success: true, message: 'Данные обновлены', data: item });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};

exports.delete = async (req, res) => {
  try {
    const item = await Storage.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Запись не найдена' });
    await item.destroy();
    res.json({ success: true, message: 'Запись удалена' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
};