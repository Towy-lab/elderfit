const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Enhanced debugging for environment variables
const dotenvPath = path.resolve(__dirname, '../.env');
console.log('Absolute path to .env file:', dotenvPath);
console.log('.env file exists at this path:', fs.existsSync(dotenvPath));
console.log('Current working directory:', process.cwd());

// Load environment variables with better debugging
const dotenv = require('dotenv');
const result = dotenv.config({ path: dotenvPath });
console.log('dotenv config result:', result.error ? 'ERROR: ' + result.error : 'Success - .env loaded');

// Manually log some critical environment variables
console.log('Environment variables check:');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'exists (first 4 chars: ' + process.env.STRIPE_SECRET_KEY.substring(0, 4) + '...)' : 'MISSING');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'exists' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'MISSING');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 31415; // Use environment variable or default to 31415

// Import routes after environment variables are loaded
const stripeRoutes = require('./routes/stripe');

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/elderfit';
console.log('Connecting to MongoDB with URI:', mongoUri);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => {
  console.error('MongoDB Connection Error:', err);
});

// Import User model
const User = require('./models/User');

// Special middleware for Stripe webhooks - must come before express.json()
// This must be defined before any other middleware that could consume the request body
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Expanded CORS configuration
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Regular middleware (after the webhook middleware)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Register Stripe routes
app.use('/api/stripe', stripeRoutes);

// Debug routes for Stripe redirects
app.get('/subscription/success', (req, res) => {
  console.log('Received Stripe success redirect:', req.query);
  res.status(200).send('Success route - this would normally redirect to your frontend');
});

app.get('/subscription/cancel', (req, res) => {
  console.log('Received Stripe cancel redirect:', req.query);
  res.status(200).send('Cancel route - this would normally redirect to your frontend');
});

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    // Debug: Log all request details
    console.log('Raw request body:', JSON.stringify(req.body));
    
    const { firstName, lastName, email, password } = req.body;
    
    // Debug: Log extracted fields
    console.log('Extracted fields:', { 
      firstName: typeof firstName + ' : ' + firstName, 
      lastName: typeof lastName + ' : ' + lastName, 
      email: typeof email + ' : ' + email,
      password: typeof password + ' : ' + (password ? '[PRESENT]' : '[MISSING]')
    });
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Check if the required fields are present
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          firstName: !!firstName,
          lastName: !!lastName,
          email: !!email,
          password: !!password
        }
      });
    }
    
    // Try to create the user with explicit fields
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      subscription: {
        tier: 'basic',
        status: 'active'
      }
    });
    
    console.log('User to be created:', {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      subscription: newUser.subscription
    });
    
    // Save user to database with detailed error handling
    try {
      await newUser.validate(); // First validate
      console.log('User validation passed!');
      await newUser.save();
      console.log('User saved successfully!');
    } catch (saveErr) {
      console.error('User save error:', saveErr);
      return res.status(400).json({ 
        error: 'Invalid user data', 
        details: saveErr.message 
      });
    }
    
    // Create JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Return user data and token
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        subscription: newUser.subscription
      }
    });
    
    console.log('Registration successful for:', email);
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Check password using the method defined in the User model
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    console.log('Login successful for:', email);
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profile: user.profile || {},
        subscription: user.subscription
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Auth middleware for protected routes
const auth = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user to request
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Protected route - get current user
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profile: user.profile || {},
      subscription: user.subscription
    });
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Profile update endpoint
app.put('/api/users/me/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { firstName, lastName, email, profile } = req.body;
    
    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (profile) {
      // Update profile fields
      user.profile = {
        ...user.profile,
        ...profile
      };
    }

    await user.save();
    
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profile: user.profile || {},
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Server shutting down...');
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Stack trace:', err.stack);
  process.exit(1);
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Server shutting down...');
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Stack trace:', err.stack);
  process.exit(1);
});