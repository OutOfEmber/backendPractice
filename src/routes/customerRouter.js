const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController.js');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware.js');

router.get('/', authMiddleware,controller.getAll);
router.get('/:id', authMiddleware,controller.getOne);
router.post('/', authMiddleware, adminMiddleware, controller.create);
router.put('/:id', authMiddleware, adminMiddleware,controller.update);
router.delete('/:id', authMiddleware, adminMiddleware,controller.delete);

module.exports = router;