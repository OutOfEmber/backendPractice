const express = require('express');
const router = express.Router();
const doorController = require('../controllers/doorController.js'); 

router.get('/', doorController.getAll);
router.get('/:id', doorController.getOne);
router.post('/', doorController.create);
router.put('/:id', doorController.update);
router.delete('/:id', doorController.delete);

module.exports = router;