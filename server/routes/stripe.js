const express = require('express');
const router = express.Router();

// Relaxed check for required environment variables - warns instead of exiting
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('WARNING: Missing STRIPE_SECRET_KEY environment variable');
  console.warn('Environment variables may not be loading correctly');
  console.warn('Current working directory:', process.cwd());
  console.warn('Module directory:', __dirname);
  // Don't exit - just continue with a warning
}

// Initialize Stripe with API key from environment variable or fallback for debugging
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
  // Don't exit, but log a clear error
}
console.log('Using Stripe API key (safely loaded):', stripeKey ? stripeKey.substring(0, 8) + '...' : 'MISSING');

const stripe = require('stripe')(stripeKey);
const auth = require('../middleware/auth');
const User = require('../models/User');

// Test Stripe connection on startup
const testStripeConnection = async () => {
  try {
    console.log('Testing Stripe connection...');
    const customers = await stripe.customers.list({ limit: 1 });
    console.log('Stripe connection successful!');
    return true;
  } catch (error) {
    console.error('Stripe connection failed:', error.message);
    return false;
  }
};

testStripeConnection();

// Verify Stripe configuration at startup
console.log('Stripe configuration:');
console.log('API Key exists:', !!process.env.STRIPE_SECRET_KEY);
console.log('Webhook Secret exists:', !!process.env.STRIPE_WEBHOOK_SECRET);

// Check for required price IDs
const requiredEnvVars = [
  'STRIPE_PRICE_PREMIUM_MONTHLY',
  'STRIPE_PRICE_PREMIUM_YEARLY',
  'STRIPE_PRICE_ELITE_MONTHLY',
  'STRIPE_PRICE_ELITE_YEARLY'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn(`WARNING: Missing environment variables: ${missingVars.join(', ')}`);
  console.warn('Some subscription features may not work correctly');
}

// Test endpoint - no auth required
router.get('/config-test', (req, res) => {
  // Check environment variables
  const config = {
    stripeKeyExists: !!process.env.STRIPE_SECRET_KEY,
    webhookSecretExists: !!process.env.STRIPE_WEBHOOK_SECRET,
    priceIDs: {
      premiumMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY ? 'Available' : 'Missing',
      premiumYearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY ? 'Available' : 'Missing',
      eliteMonthly: process.env.STRIPE_PRICE_ELITE_MONTHLY ? 'Available' : 'Missing',
      eliteYearly: process.env.STRIPE_PRICE_ELITE_YEARLY ? 'Available' : 'Missing'
    }
  };
  
  res.json({ 
    status: 'Stripe config test', 
    config 
  });
});

// Helper function to determine price ID based on tier
function getPriceIdForTier(tier, interval = 'month') {
  console.log(`Looking for price ID for tier: "${tier}", interval: "${interval}"`);
  
  // Basic tier is free, so no price ID needed
  if (tier && tier.toLowerCase() === 'basic') {
    return null;
  }
  
  // Map subscription tiers to Stripe Price IDs
  const prices = {
    'premium_month': process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    'premium_year': process.env.STRIPE_PRICE_PREMIUM_YEARLY,
    'elite_month': process.env.STRIPE_PRICE_ELITE_MONTHLY,
    'elite_year': process.env.STRIPE_PRICE_ELITE_YEARLY
  };
  
  const key = `${tier.toLowerCase()}_${interval}`;
  console.log(`Price lookup key: "${key}", Available keys:`, Object.keys(prices));
  
  const priceId = prices[key];
  if (!priceId) {
    console.error(`Missing price ID for ${key}`);
    throw new Error(`Configuration error: Price ID for ${tier} (${interval}) is not defined`);
  }
  
  return priceId;
}

// Simple checkout test with detailed debugging
router.post('/simple-checkout', auth, async (req, res) => {
  try {
    console.log('Simple checkout - received request');
    console.log('Simple checkout - req.user:', req.user);
    
    // Get user
    console.log('Simple checkout - looking up user in database');
    const user = await User.findById(req.user.id);
    console.log('Simple checkout - user found:', !!user);
    
    if (!user) {
      console.log('Simple checkout - user not found in database');
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('Simple checkout - user:', {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });

    // Use the premium monthly price ID from environment variables
    if (!process.env.STRIPE_PRICE_PREMIUM_MONTHLY) {
      return res.status(500).json({ error: 'Server configuration error: Missing price ID' });
    }
    
    const priceId = process.env.STRIPE_PRICE_PREMIUM_MONTHLY;
    console.log('Simple checkout - using price ID:', priceId);
    
    // Create Stripe customer if not exists
    if (!user.stripeCustomerId) {
      console.log('Simple checkout - creating new Stripe customer');
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        metadata: {
          userId: user._id.toString()
        }
      });
      
      console.log('Simple checkout - Stripe customer created:', customer.id);
      user.stripeCustomerId = customer.id;
      await user.save();
    } else {
      console.log('Simple checkout - using existing Stripe customer:', user.stripeCustomerId);
    }
    
    // Create checkout session
    console.log('Simple checkout - creating checkout session');
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `http://localhost:3008/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3008/subscription/cancel`,
    });
    
    console.log('Simple checkout - checkout session created:', session.id);
    console.log('Simple checkout - checkout URL:', session.url);
    
    res.json({ 
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Simple checkout - error:', error);
    
    if (error.type === 'StripeInvalidRequestError') {
      console.error('Simple checkout - Stripe error details:', {
        type: error.type,
        code: error.code,
        param: error.param
      });
    }
    
    res.status(400).json({ 
      error: error.message,
      code: error.code,
      type: error.type
    });
  }
});

// Handle Basic (free) tier signup - no Stripe needed
router.post('/signup-basic', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user's subscription to Basic tier
    user.subscription = {
      tier: 'basic',
      status: 'active',
      // No Stripe subscription ID for free tier
    };
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: 'Basic tier activated successfully',
      subscription: {
        tier: 'basic',
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Basic signup error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Create a checkout session for paid subscriptions
router.post('/create-checkout-session', auth, async (req, res) => {
  try {
    console.log('Create checkout session request body:', req.body);
    const { tier, interval = 'month' } = req.body;
    
    // Debug info
    console.log('User ID:', req.user.id);
    console.log('Tier:', tier, 'Interval:', interval);
    
    // If trying to checkout for Basic tier, redirect to the free signup
    if (tier && tier.toLowerCase() === 'basic') {
      return res.json({ 
        isFree: true,
        redirectTo: '/api/stripe/signup-basic' 
      });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get price ID for the selected tier and interval
    let priceId;
    try {
      priceId = getPriceIdForTier(tier, interval);
      console.log('Price ID for checkout:', priceId);
    } catch (error) {
      return res.status(400).json({ 
        error: error.message,
        details: { 
          tier, 
          interval,
          lookupKey: `${tier?.toLowerCase()}_${interval}`
        }
      });
    }
    
    // Create Stripe customer if not exists
    if (!user.stripeCustomerId) {
      console.log('Creating Stripe customer for user:', user.email);
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        metadata: {
          userId: user._id.toString()
        }
      });
      
      user.stripeCustomerId = customer.id;
      await user.save();
      console.log('Stripe customer created:', customer.id);
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `http://localhost:3008/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3008/subscription/cancel`,
      metadata: {
        userId: user._id.toString(),
        tier: tier,
        interval: interval
      },
      subscription_data: {
        metadata: {
          tier: tier,
          interval: interval
        }
      }
    });
    
    console.log('Checkout session created successfully:', session.id);
    res.json({ 
      isFree: false,
      sessionId: session.id,
      url: session.url // Add the URL for direct redirection
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    console.error('Stack trace:', error.stack);
    res.status(400).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Test endpoint for Stripe connection
router.get('/test-stripe-connection', async (req, res) => {
  try {
    console.log('Testing Stripe connection with API key from environment variables');

    // Try to make a simple Stripe API call
    const result = await stripe.customers.list({ limit: 1 });
    
    // Return success response with details
    res.json({
      success: true,
      message: 'Stripe connection successful',
      customersCount: result.data.length,
      stripeAPIVersion: stripe.getApiField('version')
    });
  } catch (error) {
    console.error('Stripe test error:', error);
    
    // Return detailed error information
    res.status(500).json({
      success: false,
      error: error.message,
      type: error.type,
      code: error.code,
      apiKeyProvided: !!process.env.STRIPE_SECRET_KEY
    });
  }
});

// Retrieve subscription details
router.get('/subscription', auth, async (req, res) => {
  try {
    console.log('Getting subscription for user ID:', req.user.id);
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }
    
    console.log('User found:', user.email);
    
    // If user has no subscription information at all
    if (!user.subscription) {
      return res.json({ hasSubscription: false });
    }
    
    // If user has a basic subscription (which is free)
    if (user.subscription.tier === 'basic' && !user.subscription.id) {
      return res.json({
        hasSubscription: true,
        tier: 'basic',
        status: 'active',
        isFree: true
      });
    }
    
    // If user has a paid subscription that needs to be retrieved from Stripe
    if (user.subscription.id) {
      try {
        // Get the latest subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
        
        // Format the response
        const response = {
          hasSubscription: true,
          status: subscription.status,
          tier: user.subscription.tier,
          interval: subscription.items.data[0].plan.interval || 'month',
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          isFree: false,
          downgradeToBasic: user.subscription.downgradeToBasic || false,
          priceId: subscription.items.data[0].price.id,
          lastUpdated: new Date()
        };
        
        return res.json(response);
      } catch (stripeErr) {
        console.error('Stripe error retrieving subscription:', stripeErr);
        
        // If the subscription doesn't exist in Stripe anymore, reset to basic
        if (stripeErr.code === 'resource_missing') {
          user.subscription = {
            tier: 'basic',
            status: 'active'
          };
          await user.save();
          
          return res.json({
            hasSubscription: true,
            tier: 'basic',
            status: 'active',
            isFree: true
          });
        }
        
        // For other errors, return the error
        throw stripeErr;
      }
    }
    
    // Default case - user has subscription object but no active subscription
    return res.json({ 
      hasSubscription: false, 
      tier: user.subscription.tier || 'basic'
    });
  } catch (error) {
    console.error('Subscription retrieval error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Export the router
module.exports = router;