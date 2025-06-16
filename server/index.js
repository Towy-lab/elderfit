const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const https = require('https');
const WebSocket = require('ws');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'exists' : 'MISSING');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'exists' : 'MISSING');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'MISSING');

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
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const stripeRoutes = require('./routes/stripe');
const contentRoutes = require('./routes/content');
const devicesRoutes = require('./routes/devices');
const progressRoutes = require('./routes/progress');

// Connect to MongoDB with retry logic
const connectWithRetry = async (retries = 5, delay = 5000) => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elderfit';
  console.log('Attempting to connect to MongoDB...');
  console.log('MongoDB URI:', mongoUri);

  try {
    // Set strictQuery to false to prepare for Mongoose 7
    mongoose.set('strictQuery', false);
    
    // Add connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(mongoUri, options);
    console.log('MongoDB Connected Successfully');
    
    // Log connection details
    const db = mongoose.connection.db;
    console.log('Connected to database:', db.databaseName);
    console.log('MongoDB version:', await db.admin().serverInfo().then(info => info.version));
    
  } catch (err) {
    console.error('MongoDB Connection Error Details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });

    if (retries > 0) {
      console.log(`MongoDB connection failed. Retrying in ${delay/1000} seconds... (${retries} attempts remaining)`);
      setTimeout(() => connectWithRetry(retries - 1, delay), delay);
    } else {
      console.error('Failed to connect to MongoDB after multiple retries. Please ensure MongoDB is running.');
      console.error('You can start MongoDB using:');
      console.error('1. Windows: Start MongoDB service from Services');
      console.error('2. Or run: mongod --dbpath="C:/data/db"');
      process.exit(1);
    }
  }
};

// Add MongoDB connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectWithRetry();
});

// Start MongoDB connection
connectWithRetry();

// Import User model
const User = require('./models/User');

// Special middleware for Stripe webhooks - must come before express.json()
// This must be defined before any other middleware that could consume the request body
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

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

// Function to start server with retry logic
const startServer = (retries = 3) => {
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
  const wss = new WebSocket.Server({ 
    server,
    path: '/ws'
  });

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