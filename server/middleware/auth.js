// Enhanced auth middleware - update this in your server/middleware/auth.js file
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    let token;
    
    // Handle different authorization header formats
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '');
    } else {
      token = authHeader; // Try using the header value directly
    }
    
    // Also check for token in query params (for easier debugging)
    if (!token && req.query.token) {
      token = req.query.token;
    }
    
    // Check for token in the body for POST requests
    if (!token && req.body && req.body.token) {
      token = req.body.token;
    }
    
    if (!token) {
      console.log(`No token provided in request to ${req.originalUrl}`);
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
    
    // Add debug logging
    console.log(`Auth middleware processing token for ${req.originalUrl}: ${token.substring(0, 10)}...`);
    
    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user to request - handle both id and userId fields for compatibility
      req.user = { 
        id: decoded.id || decoded.userId
      };
      
      if (!req.user.id) {
        console.error('No user ID found in token:', decoded);
        return res.status(401).json({ error: 'Invalid token format' });
      }
      
      console.log(`Auth successful for user ${req.user.id} accessing ${req.originalUrl}`);
      next();
    } catch (jwtError) {
      console.error(`JWT verification failed for ${req.originalUrl}:`, jwtError.message);
      return res.status(401).json({ error: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Server error in auth middleware' });
  }
};

module.exports = auth;