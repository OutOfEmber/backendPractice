const express = require('express');
const router = express.Router();
const doorController = require('../controllers/doorController.js'); 
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware.js');

router.get('/', doorController.getAll);
router.get('/:id', doorController.getOne);
router.post('/', authMiddleware, adminMiddleware, doorController.create);
router.put('/:id', authMiddleware, adminMiddleware, doorController.update);
router.delete('/:id', authMiddleware, adminMiddleware, doorController.delete);

module.exports = router;