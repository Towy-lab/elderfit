// server/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Import the User model
const User = require('../models/User');

// Import auth middleware (for protected routes)
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', [
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  console.log('Register attempt:', req.body.email);
  
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user (password will be hashed by pre-save hook)
    user = new User({
      firstName,
      lastName,
      email,
      password,
      subscription: {
        tier: 'basic',
        status: 'active',
        isFree: true,
        startDate: new Date(),
        currentPeriodEnd: new Date(2099, 11, 31)
      }
    });

    // Save user to database
    await user.save();
    console.log('User saved to database');

    // Create JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Registration successful for:', email);
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
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  console.log('Login attempt:', {
    email: req.body.email,
    timestamp: new Date().toISOString()
  });

  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Login failed - missing credentials');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('Login failed - user not found:', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      console.log('Login failed - invalid password:', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // If user has a Stripe subscription, verify it
    if (user.subscription && user.subscription.id) {
      try {
        const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
        
        // Check if subscription is active
        if (subscription.status === 'active') {
          // Update user's subscription status
          user.subscription.status = subscription.status;
          user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
          user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
        } else {
          // If subscription is not active, reset to basic tier
          user.subscription = {
            tier: 'basic',
            status: 'active',
            isFree: true,
            startDate: new Date(),
            currentPeriodEnd: new Date(2099, 11, 31)
          };
        }
        
        await user.save();
      } catch (stripeErr) {
        console.error('Stripe error during login:', stripeErr);
        // If subscription doesn't exist in Stripe or any other error, reset to basic tier
        user.subscription = {
          tier: 'basic',
          status: 'active',
          isFree: true,
          startDate: new Date(),
          currentPeriodEnd: new Date(2099, 11, 31)
        };
        await user.save();
      }
    } else {
      // If no subscription exists, ensure user has basic tier
      user.subscription = {
        tier: 'basic',
        status: 'active',
        isFree: true,
        startDate: new Date(),
        currentPeriodEnd: new Date(2099, 11, 31)
      };
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

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
  } catch (error) {
    console.error('Login error:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Get user from database (auth middleware adds user ID to request)
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return formatted user object with consistent fields
    res.json({
      _id: user._id,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profile: user.profile || {},
      subscription: user.subscription || {
        tier: 'basic',
        status: 'active',
        isFree: true
      }
    });
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/auth/me/profile
// @desc    Update user profile
// @access  Private
router.put('/me/profile', auth, async (req, res) => {
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
        ...profile,
        // Ensure numeric fields are properly converted
        age: profile.age ? Number(profile.age) : undefined,
        height: profile.height ? Number(profile.height) : undefined,
        weight: profile.weight ? Number(profile.weight) : undefined
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

module.exports = router;