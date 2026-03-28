const redisClient = require('../config/redis');
const { fetchWeatherFromAPI } = require('../services/weatherService');

// @desc    Get weather (checks cache first, then calls service)
// @route   GET /api/weather/:city
const getWeather = async (req, res) => {
    try {
        const { city } = req.params;
        const cacheKey = `weather:${city.toLowerCase()}`;

        // 1. Check Redis Cache
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log(`⚡ Serving weather for ${city} from Redis Cache`);
            return res.status(200).json({ success: true, source: 'cache', data: JSON.parse(cachedData) });
        }

        // 2. Fetch from Service
        console.log(`🌍 Fetching weather for ${city} from OpenWeather API`);
        const weatherData = await fetchWeatherFromAPI(city);

        // 3. Save to Cache
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(weatherData));

        // 4. Send Response
        return res.status(200).json({ success: true, source: 'api', data: weatherData });

    } catch (error) {
        console.error('Weather Controller Error:', error.message);
        // If it's the "City not found" error from our service, send a 404
        if (error.message.includes('City not found')) {
            return res.status(404).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Server error while fetching weather' });
    }
};

module.exports = { getWeather };