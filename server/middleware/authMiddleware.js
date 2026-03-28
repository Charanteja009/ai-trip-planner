const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (Format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the user ID to the request object so the next route can use it
            req.user = { id: decoded.id };

            next(); // Move on to the actual route
        } catch (error) {
            console.error('Not authorized, token failed');
            return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

module.exports = { protect };