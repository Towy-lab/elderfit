import dotenv from 'dotenv';

// Load environment variables FIRST, before ANY other code
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import https from 'https';
import { WebSocketServer } from 'ws';
import Stripe from 'stripe';

import { fileURLToPath } from 'url';

// Load environment variables FIRST, before any other imports that might need them
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dotenvPath = path.resolve(__dirname, '../.env');

// Enhanced debugging for environment variables
console.log('Absolute path to .env file:', dotenvPath);
console.log('.env file exists at this path:', fs.existsSync(dotenvPath));
console.log('Current working directory:', process.cwd());

// Load environment variables with better debugging
const result = dotenv.config({ path: dotenvPath });
console.log('dotenv config result:', result.error ? 'ERROR: ' + result.error : 'Success - .env loaded');

// Manually log some critical environment variables
console.log('Environment variables check:');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'exists' : 'MISSING');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'exists' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'MISSING');

// Import routes AFTER environment variables are loaded
import authRoutes from './routes/auth.js';
import subscriptionRoutes from './routes/subscription.js';
import stripeRoutes from './routes/stripe.js';
import contentRoutes from './routes/content.js';
import devicesRoutes from './routes/devices.js';
import progressRoutes from './routes/progress.js';

// Import models
import User from './models/User.js';

// Mongoose Debugging
mongoose.set('debug', (collectionName, method, query, doc) => {
  console.log(`[Mongoose] ${collectionName}.${method}`, JSON.stringify(query), doc);
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Express app
const app = express();
let PORT = process.env.PORT || 31415;
let TEMP_PORT = 31416; // Temporary port to use while waiting for 31415
let server = null;

// Read SSL certificate files with error handling
let credentials;
try {
  const privateKey = fs.readFileSync(path.join(__dirname, '../certs/private-key.pem'), 'utf8');
  const certificate = fs.readFileSync(path.join(__dirname, '../certs/certificate.pem'), 'utf8');
  credentials = { 
    key: privateKey, 
    cert: certificate
  };
  console.log('SSL certificates loaded successfully');
} catch (error) {
  console.error('Error loading SSL certificates:', error);
  process.exit(1);
}

// Expanded CORS configuration
app.use(cors({
  origin: ['https://localhost:3000', 'http://localhost:3000'], // Allow both HTTP and HTTPS in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Add CORS headers for preflight requests
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    if (origin && (origin.includes('localhost:3000'))) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Max-Age', '86400');
      res.status(200).end();
      return;
    }
  }
  next();
});

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Log response
  const originalSend = res.send;
  res.send = function (body) {
    console.log('Outgoing response:', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      body: body,
      timestamp: new Date().toISOString()
    });
    return originalSend.call(this, body);
  };

  next();
});

// Regular middleware (after the webhook middleware)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/progress', progressRoutes);

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
    console.log('Login attempt received:', {
      body: req.body,
      headers: req.headers,
      ip: req.ip
    });

    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Login attempt failed: Missing credentials', { email: !!email, password: !!password });
      return res.status(400).json({ 
        error: 'Missing credentials',
        details: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login attempt failed: User not found', { email });
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Debug: Log the user's subscription data
    console.log('User subscription data from database:', {
      userId: user._id,
      email: user.email,
      subscription: user.subscription,
      hasStripeId: !!(user.subscription && user.subscription.id),
      tier: user.subscription?.tier,
      planLevel: user.subscription?.planLevel,
      status: user.subscription?.status
    });
    
    // Check password using the method defined in the User model
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log('Login attempt failed: Invalid password', { email });
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // If user has a Stripe subscription, verify it
    if (user.subscription && user.subscription.id) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
        
        // Update user's subscription status
        user.subscription.status = subscription.status;
        user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
        user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
        
        // If subscription is not active, reset to basic tier
        if (subscription.status !== 'active') {
          user.subscription = {
            tier: 'basic',
            status: 'active'
          };
        }
        
        await user.save();
      } catch (stripeErr) {
        console.error('Stripe error during login:', stripeErr);
        // If subscription doesn't exist in Stripe, reset to basic tier
        if (stripeErr.code === 'resource_missing') {
          user.subscription = {
            tier: 'basic',
            status: 'active'
          };
          await user.save();
        }
      }
    } else {
      // User has no Stripe subscription ID - preserve existing subscription data
      console.log('User has no Stripe subscription ID, preserving existing subscription data:', user.subscription);
      
      // Only set basic subscription if user has no subscription data at all
      if (!user.subscription || !user.subscription.tier) {
        console.log('User has no subscription data, setting basic tier');
        user.subscription = {
          tier: 'basic',
          status: 'active',
          isFree: true,
          startDate: new Date(),
          currentPeriodEnd: new Date('2099-12-31')
        };
        await user.save();
      } else {
        console.log('Preserving existing subscription tier:', user.subscription.tier);
        // Don't save - just preserve the existing data
      }
    }
    
    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    console.log('Login successful:', { 
      userId: user._id,
      email: user.email,
      subscription: user.subscription,
      timestamp: new Date().toISOString()
    });

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
    console.error('Login error:', {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public'), {
  setHeaders: (res, path) => {
    console.log('Serving static file:', path);
    // Set proper MIME types for images
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    }
    // Disable caching for development
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
}));

// Health data endpoint
app.get('/api/health/data', auth, async (req, res) => {
  try {
    console.log('Fetching health data for user:', req.user.id);
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user's health data
    const healthData = {
      healthInfo: user.healthInfo || {
        mobilityLevel: 'medium',
        medicalConditions: [],
        medications: [],
        healthGoals: []
      },
      profile: user.profile || {
        fitnessLevel: 'beginner',
        goals: [],
        healthConditions: [],
        equipment: [],
        height: null,
        weight: null,
        age: null
      },
      images: {
        jointHealth: '/images/joint-health.jpg',
        jointHealthHero: '/images/joint-health-hero.jpg',
        sleepRecovery: '/images/sleep-recovery.jpg',
        seniorNutrition: '/images/senior-nutrition.jpg'
      }
    };

    console.log('Health data retrieved:', healthData);
    res.json(healthData);
  } catch (err) {
    console.error('Error getting health data:', err);
    res.status(500).json({ error: 'Failed to fetch health data' });
  }
});

// Test route for image serving
app.get('/test-images', (req, res) => {
  const images = [
    '/images/joint-health.jpg',
    '/images/joint-health-hero.jpg',
    '/images/sleep-recovery.jpg',
    '/images/senior-nutrition.jpg'
  ];
  
  res.json({
    message: 'Image paths for testing',
    images,
    publicPath: path.join(__dirname, '../public'),
    imageExists: images.map(img => ({
      path: img,
      exists: fs.existsSync(path.join(__dirname, '../public', img))
    }))
  });
});

// Database Connection
const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  console.log(`Attempting to connect to MongoDB...`);

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connection established.');
  });

  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection disconnected.');
  });

  try {
    await mongoose.connect(mongoUri);
  } catch (err) {
    console.error('Failed to connect to MongoDB on initial setup:', err);
    process.exit(1);
  }
};

// Function to start server with retry logic
const startServer = async (retries = 3) => {
  // Ensure DB is connected before starting server
  await dbConnect();

  // If there's an existing server, close it first
  if (server) {
    server.close(() => {
      console.log('Previous server instance closed');
      // Add a small delay to ensure the port is released
      setTimeout(() => {
        createAndStartServer();
      }, 2000);
    });
  } else {
    createAndStartServer();
  }
};

// Separate function to create and start the server
const createAndStartServer = () => {
  // Create new HTTPS server
  server = https.createServer(credentials, app);

  // Create WebSocket server
  const wss = new WebSocketServer({ server });

  // WebSocket connection handler
  wss.on('connection', (ws, req) => {
    console.log('WebSocket client connected from:', req.socket.remoteAddress);

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received WebSocket message:', data);
        // Handle the message here
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // Send a welcome message
    ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));
  });

  // Try to start the server
  try {
    server.listen(PORT, () => {
      console.log(`HTTPS Server running on port ${PORT}`);
      console.log(`WebSocket server available at wss://localhost:${PORT}/ws`);
    });
  } catch (err) {
    if (err.code === 'EADDRINUSE' && retries > 0) {
      console.log(`Port ${PORT} is busy, trying temporary port ${TEMP_PORT}...`);
      const originalPort = PORT;
      PORT = TEMP_PORT;
      TEMP_PORT++;
      
      // Try to start on temporary port
      server.listen(PORT, () => {
        console.log(`HTTPS Server running on temporary port ${PORT}`);
        console.log(`WebSocket server available at wss://localhost:${PORT}/ws`);
        
        // Try to switch back to original port after a delay
        setTimeout(() => {
          server.close(() => {
            console.log(`Switching back to original port ${originalPort}...`);
            PORT = originalPort;
            startServer(retries - 1);
          });
        }, 5000);
      });
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  }

  // Handle server errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && retries > 0) {
      console.log(`Port ${PORT} is busy, trying temporary port ${TEMP_PORT}...`);
      const originalPort = PORT;
      PORT = TEMP_PORT;
      TEMP_PORT++;
      
      // Try to start on temporary port
      server.listen(PORT, () => {
        console.log(`HTTPS Server running on temporary port ${PORT}`);
        console.log(`WebSocket server available at wss://localhost:${PORT}/ws`);
        
        // Try to switch back to original port after a delay
        setTimeout(() => {
          server.close(() => {
            console.log(`Switching back to original port ${originalPort}...`);
            PORT = originalPort;
            startServer(retries - 1);
          });
        }, 5000);
      });
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTPS server...');
  if (server) {
    server.close(() => {
      console.log('HTTPS server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Closing HTTPS server...');
  if (server) {
    server.close(() => {
      console.log('HTTPS server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  }
});

// Start the server at the end of the file
startServer();

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({
    error: 'Server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});