const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController.js');
const { authMiddleware } = require('../middleware/authMiddleware')

router.get('/', authMiddleware,controller.getAll);
router.get('/:id', authMiddleware,controller.getOne);
router.post('/', authMiddleware,controller.create);
router.put('/:id', authMiddleware,controller.update);
router.delete('/:id', authMiddleware,controller.delete);

module.exports = router;