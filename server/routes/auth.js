// server/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import stripe from 'stripe';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

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
        const subscription = await stripeInstance.subscriptions.retrieve(user.subscription.id);
        
        // Check if subscription is active
        if (subscription.status === 'active') {
          // Update user's subscription status and tier from Stripe metadata
          user.subscription.status = subscription.status;
          user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
          user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
          
          // Update tier from Stripe metadata if available
          if (subscription.metadata && subscription.metadata.tier) {
            user.subscription.tier = subscription.metadata.tier;
            console.log('Updated tier from Stripe metadata:', subscription.metadata.tier);
          }
          
          // Also check the price ID to determine tier if metadata is not available
          if (!subscription.metadata?.tier && subscription.items?.data?.length > 0) {
            const priceId = subscription.items.data[0].price.id;
            // Map price IDs to tiers based on your Stripe configuration
            if (priceId === process.env.STRIPE_PRICE_ELITE_MONTHLY || priceId === process.env.STRIPE_PRICE_ELITE_YEARLY) {
              user.subscription.tier = 'elite';
            } else if (priceId === process.env.STRIPE_PRICE_PREMIUM_MONTHLY || priceId === process.env.STRIPE_PRICE_PREMIUM_YEARLY) {
              user.subscription.tier = 'premium';
            }
            console.log('Updated tier from price ID:', priceId, '->', user.subscription.tier);
          }
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
      // If no Stripe subscription ID exists, preserve existing subscription data
      // Only set basic tier if no subscription exists at all
      if (!user.subscription) {
        user.subscription = {
          tier: 'basic',
          status: 'active',
          isFree: true,
          startDate: new Date(),
          currentPeriodEnd: new Date(2099, 11, 31)
        };
        await user.save();
      }
      // If subscription exists but no Stripe ID, keep the existing subscription data
      console.log('Preserving existing subscription data:', user.subscription);
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
router.get('/me', authMiddleware, async (req, res) => {
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
router.put('/me/profile', authMiddleware, async (req, res) => {
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

// Debug endpoint to check subscription status
router.get('/debug-subscription', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let stripeSubscription = null;
    if (user.subscription && user.subscription.id) {
      try {
        stripeSubscription = await stripeInstance.subscriptions.retrieve(user.subscription.id);
      } catch (error) {
        console.error('Error retrieving Stripe subscription:', error.message);
      }
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        subscription: user.subscription
      },
      stripeSubscription: stripeSubscription ? {
        id: stripeSubscription.id,
        status: stripeSubscription.status,
        metadata: stripeSubscription.metadata,
        priceId: stripeSubscription.items?.data?.[0]?.price?.id,
        currentPeriodEnd: stripeSubscription.current_period_end
      } : null,
      environment: {
        eliteMonthlyPrice: process.env.STRIPE_PRICE_ELITE_MONTHLY,
        eliteYearlyPrice: process.env.STRIPE_PRICE_ELITE_YEARLY,
        premiumMonthlyPrice: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
        premiumYearlyPrice: process.env.STRIPE_PRICE_PREMIUM_YEARLY
      }
    });
  } catch (error) {
    console.error('Debug subscription error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;