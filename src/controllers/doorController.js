const Door = require('../database/models/Door.js');

exports.getAll = async (req, res) => {
  try {
    const doors = await Door.findAll();
    res.json({ success: true, data: doors, count: doors.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const door = await Door.findByPk(req.params.id);
    if (!door) return res.status(404).json({ success: false, message: 'Дверь не найдена' });
    res.json({ success: true, data: door });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newDoor = await Door.create(req.body);
    res.status(201).json({ success: true, data: newDoor });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const door = await Door.findByPk(req.params.id);
    if (!door) return res.status(404).json({ success: false, message: 'Дверь не найдена' });
    
    await door.update(req.body);
    res.json({ success: true, message: 'Данные обновлены', data: door });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const door = await Door.findByPk(req.params.id);
    if (!door) return res.status(404).json({ success: false, message: 'Дверь не найдена' });
    
    await door.destroy();
    res.json({ success: true, message: 'Дверь удалена' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};