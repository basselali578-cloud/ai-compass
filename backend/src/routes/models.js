const express = require('express');
const router = express.Router();
const { getAllModels, getModelById, createModel } = require('../controllers/modelsController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', getAllModels);
router.get('/:id', getModelById);
router.post('/', authMiddleware, createModel);

module.exports = router;
