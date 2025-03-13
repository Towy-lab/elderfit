const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 31415;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple in-memory user store (replace with MongoDB in production)
const users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    // Password: "password123"
    password: '$2a$10$XFE.rQ1AuSsUAO1f/dTPceZiGwWzuqA3UroaEYAOsQvJYBnFiqNdK',
    age: 65,
    subscription: {
      type: 'basic',
      startDate: new Date()
    }
  }
];

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    console.log('Register attempt:', req.body);
    
    // Check if user exists
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      age: age || 55,
      subscription: {
        type: 'basic',
        startDate: new Date()
      }
    };
    
    // Add to users array
    users.push(newUser);
    
    // Create JWT
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    
    // Return user data and token
    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        age: newUser.age,
        subscription: newUser.subscription
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt for:', req.body.email);
    console.log('Request body:', req.body);
    
    // For testing purposes, allow any login
    // Create JWT token
    const token = jwt.sign({ userId: "test-user-id" }, process.env.JWT_SECRET || 'fallback-secret', { expiresIn: '7d' });
    
    console.log('Login successful for:', req.body.email);
    res.json({
      token,
      user: {
        id: "test-user-id",
        name: "Test User",
        email: req.body.email || "test@example.com",
        age: 65,
        subscription: {
          type: 'basic',
          startDate: new Date()
        }
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Add user to request
    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

// Protected route example
app.get('/api/auth/me', auth, (req, res) => {
  // For testing, return a test user
  res.json({
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    age: 65,
    subscription: {
      type: 'basic',
      startDate: new Date()
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});