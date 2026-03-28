const redis = require('redis');
require('dotenv').config();

// Initialize the Redis Client
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
    socket: {
        family: 4, // THIS IS THE FIX: Forces standard IPv4 routing
        tls: true,
        rejectUnauthorized: false
    }
});

// Changed 'err.message' to 'err' so we can see the full detailed error if it fails
redisClient.on('error', (err) => console.error('❌ Redis Error:', err));
redisClient.on('connect', () => console.log('✅ Successfully connected to Redis (Upstash)'));

redisClient.connect().catch(console.error);

module.exports = redisClient;