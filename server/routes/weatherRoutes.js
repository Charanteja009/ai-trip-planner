const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

// The 'protect' middleware ensures the user has a valid JWT token
router.get('/:city', protect, getWeather);

module.exports = router;