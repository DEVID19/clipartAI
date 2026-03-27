const express = require('express');
const router = express.Router();
const { getHistory, deleteGeneration } = require('../controllers/historyController');

// GET /api/history/:sessionId
router.get('/:sessionId', getHistory);

// DELETE /api/history/:generationId
router.delete('/:generationId', deleteGeneration);

module.exports = router;
