const { Pool } = require('pg');
require('dotenv').config();

// Initialize the PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon requires SSL for external connections
    ssl: {
        rejectUnauthorized: false
    }
});

// Test the connection immediately when the server starts
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error acquiring client from database pool', err.stack);
    } else {
        console.log('✅ Successfully connected to the PostgreSQL database (Neon)');
    }
    if (client) release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};