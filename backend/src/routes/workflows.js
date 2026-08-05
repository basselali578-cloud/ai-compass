const express = require('express');
const router = express.Router();
const { getWorkflows, getWorkflowBySlug } = require('../controllers/workflowsController');

router.get('/', getWorkflows);
router.get('/:slug', getWorkflowBySlug);

module.exports = router;
