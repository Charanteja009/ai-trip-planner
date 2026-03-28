const db = require('../config/db');
const redisClient = require('../config/redis'); // Added this import
const { generateTripItinerary } = require('../services/aiService');
const { tripRequestSchema } = require('../utils/validators');

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

// @desc    Generate a new trip via AI (with Redis Caching) and save to DB
const generateAndSaveTrip = async (req, res) => {
    try {
        // 1. Zod Validation
        const validation = tripRequestSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({ 
                success: false, 
                message: validation.error.errors[0].message 
            });
        }
        
        // 2. Destructure the clean, validated data
        const { destination, startDate, endDate, budget } = validation.data;
        const userId = req.user.id; 

        // --- NEW CACHE LOGIC ---
        const cacheKey = `trip:${destination.toLowerCase()}:${startDate}:${endDate}:${budget.toLowerCase()}`;
        
        // Check if this exact trip already exists in Redis
        const cachedTrip = await redisClient.get(cacheKey);
        
        if (cachedTrip) {
            console.log(`⚡ [Redis Cache] Hit for ${destination}! Serving instantly.`);
            const generatedTripData = JSON.parse(cachedTrip);

            // Even if cached, we save to Postgres so it shows in the user's 'My Trips'
            const insertQuery = `
                INSERT INTO trips (user_id, destination, start_date, end_date, budget_level, trip_data) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING *;
            `;
            const newTrip = await db.query(insertQuery, [
                userId, destination, startDate, endDate, budget, JSON.stringify(generatedTripData)
            ]);

            return res.status(200).json({
                success: true,
                message: 'Trip served from cache',
                trip: newTrip.rows[0]
            });
        }
        // --- END CACHE LOGIC ---

        // 3. Call AI Service (If not in cache)
        console.log(`🤖 Generating trip to ${destination} from ${startDate} to ${endDate}...`);
        const generatedTripData = await generateTripItinerary(destination, startDate, endDate, budget);
        
        // 4. Save to Redis (Cache it for 24 hours / 86400 seconds)
        await redisClient.setEx(cacheKey, 86400, JSON.stringify(generatedTripData));

        // 5. Save to Neon PostgreSQL
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

module.exports = { generateAndSaveTrip, getMyTrips };