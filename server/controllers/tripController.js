const db = require('../config/db');
const { generateTripItinerary } = require('../services/aiService');
const { tripRequestSchema } = require('../utils/validators');

// @desc    Generate a new trip via AI and save to DB
// @route   POST /api/trips/generate
// @desc    Get all trips for logged in user
const getMyTrips = async (req, res) => {
    try {
        const userId = req.user.id;
        const trips = await db.query(
            'SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC', 
            [userId]
        );
        res.status(200).json({ success: true, trips: trips.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching trips' });
    }
};


const generateAndSaveTrip = async (req, res) => {
    try {
        // 1. Zod Validation (This replaces all manual if-checks)
        const validation = tripRequestSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({ 
                success: false, 
                message: validation.error.errors[0].message 
            });
        }
        
        // 2. Destructure the clean, validated data
        const { destination, startDate, endDate, budget } = validation.data;
        const userId = req.user.id; // From authMiddleware
        
        // 3. Call AI Service (RAG Pipeline)
        console.log(`🤖 Generating trip to ${destination} from ${startDate} to ${endDate}...`);
        const generatedTripData = await generateTripItinerary(destination, startDate, endDate, budget);
        
        // 4. Save to Neon PostgreSQL
        const insertQuery = `
            INSERT INTO trips (user_id, destination, start_date, end_date, budget_level, trip_data) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *;
        `;
        
        const newTrip = await db.query(insertQuery, [
            userId, 
            destination, 
            startDate, 
            endDate, 
            budget, 
            JSON.stringify(generatedTripData)
        ]);
        
        console.log('✅ Trip successfully generated and saved to database');
        
        // 5. Final Response
        res.status(201).json({
            success: true,
            message: 'Trip generated successfully',
            trip: newTrip.rows[0]
        });
        
    } catch (error) {
        console.error('Trip Generation Controller Error:', error);
        res.status(500).json({ success: false, message: 'Server error generating trip' });
    }
};

module.exports = { generateAndSaveTrip, getMyTrips }; // Update your exports!