const express = require('express');
const router = express.Router();
const { generateAndSaveTrip, getMyTrips } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

// Route requires JWT token to run
router.post('/generate', protect, generateAndSaveTrip);
router.get('/my-trips', protect, getMyTrips);
module.exports = router;