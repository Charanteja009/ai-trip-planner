require('dotenv').config();
const express = require('express');
const cors = require('cors');



// 1. Trigger the database connection (Neon)
require('./config/db'); 
require('./config/redis');
// 2. Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Global Middleware
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
})); // Allows frontend to talk to backend
app.use(express.json()); // Allows Express to read JSON bodies

// 4. Routes
app.use('/api/auth', require('./routes/authRoutes'));
// We will uncomment these as we build them:
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));

// Health Check Route (To test if server is alive)
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'AI Trip Planner Server is running' });
});

// 5. Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong on the server',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// 6. Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});