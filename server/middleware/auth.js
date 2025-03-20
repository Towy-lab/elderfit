// server/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  console.log('Auth middleware - checking token');
  
  // Check if no token
  if (!token) {
    console.log('Auth middleware - no token provided');
    return res.status(401).json({ error: 'Authorization denied' });
  }

  try {
    // Verify token
    console.log('Auth middleware - verifying token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - decoded token:', decoded);
    
    // Add user from payload
    req.user = { id: decoded.userId };
    console.log('Auth middleware - set req.user:', req.user);
    next();
  } catch (err) {
    console.error('Auth middleware - token verification failed:', err);
    res.status(401).json({ error: 'Token is not valid' });
  }
};