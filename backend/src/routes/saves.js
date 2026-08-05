const express = require('express');
const router = express.Router();
const { getSavedTools, saveTool, unsaveTool } = require('../controllers/savesController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getSavedTools);
router.post('/', authMiddleware, saveTool);
router.delete('/:toolId', authMiddleware, unsaveTool);

module.exports = router;
