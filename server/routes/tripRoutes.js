const express = require('express');
const router = express.Router();
const { generateAndSaveTrip, getMyTrips } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const generateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, 
    message: { 
        success: false, 
        message: "You have reached the maximum of 5 AI-generated trips per 15 minutes. Please take a break and try again shortly!" 
    }
});

// Added 'generateLimiter' back to the POST route for protection
router.post('/generate', protect, generateLimiter, generateAndSaveTrip);
router.get('/my-trips', protect, getMyTrips);

module.exports = router;