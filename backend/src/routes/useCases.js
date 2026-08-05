const express = require('express');
const router = express.Router();
const { getUseCases } = require('../controllers/useCasesController');

router.get('/', getUseCases);

module.exports = router;
