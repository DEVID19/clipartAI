const express = require('express');
const router = express.Router();
const { generateCliparts, getGenerationStatus } = require('../controllers/generationController');
const { validateImageUpload, validateStyles } = require('../middleware/validate');
const { generationRateLimiter } = require('../middleware/rateLimiter');

// POST /api/generation/generate
router.post(
  '/generate',
  generationRateLimiter,
  validateImageUpload,
  validateStyles,
  generateCliparts
);

// GET /api/generation/status/:sessionId
router.get('/status/:sessionId', getGenerationStatus);

module.exports = router;
