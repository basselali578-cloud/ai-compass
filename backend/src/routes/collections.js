const express = require('express');
const router = express.Router();
const { getCollections, getCollectionBySlug } = require('../controllers/collectionsController');

router.get('/', getCollections);
router.get('/:slug', getCollectionBySlug);

module.exports = router;
