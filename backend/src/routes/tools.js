const express = require('express');
const router = express.Router();
const { getAllTools, getToolById, getToolByName, createTool, searchTools, getTrendingTools, getGemTools } = require('../controllers/toolsController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', getAllTools);
router.get('/search', searchTools);
router.get('/trending', getTrendingTools);
router.get('/gems', getGemTools);
router.get('/by-name/:name', getToolByName);
router.get('/:id', getToolById);
router.post('/', authMiddleware, createTool);

module.exports = router;
