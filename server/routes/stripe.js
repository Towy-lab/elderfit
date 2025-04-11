const express = require('express');
const router = express.Router();

// Initialize Stripe with explicit API key
const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51R40QxGCjT8uHlI9Cm4115aFjcHwPhs9TmoChHaAtPOlEuOyDLUFyNJCdrVwVzYts8r3GaypZRXa3PQntOv3GfPw00aEYuFF2r';
console.log('Using Stripe API key (first 8 chars):', apiKey.substring(0, 8) + '...');

// Initialize Stripe with the key
const stripe = require('stripe')(apiKey);

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
console.log('API Key exists:', !!apiKey);
console.log('Webhook Secret exists:', !!process.env.STRIPE_WEBHOOK_SECRET);

// Add this to server/routes/stripe.js
router.get('/verify-session/:sessionId', auth, async (req, res) => {
  try {
    const { sessionId } = req.params;
    console.log('🔍 Verifying session:', sessionId);
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Session details:', {
      id: session.id,
      status: session.status,
      paymentStatus: session.payment_status,
      customerId: session.customer,
      subscriptionId: session.subscription
    });
    
    // If the session has a subscription, update the user's subscription
    if (session.subscription && session.payment_status === 'paid') {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      
      // Determine tier from metadata or default to premium
      const tier = session.metadata?.tier || 'premium';
      
      // Update user's subscription
      user.subscription = {
        id: session.subscription,
        status: subscription.status,
        tier: tier,
        priceId: subscription.items.data[0].price.id,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      };
      
      await user.save();
      console.log(`✅ Subscription ${session.subscription} activated for user ${user._id}`);
      
      return res.json({
        success: true,
        subscription: {
          id: session.subscription,
          status: subscription.status,
          tier: user.subscription.tier
        }
      });
    }
    
    res.json({ 
      success: true,
      session: {
        status: session.status,
        paymentStatus: session.payment_status,
        hasSubscription: !!session.subscription
      }
    });
  } catch (error) {
    console.error('Session verification error:', error);
    res.status(400).json({ error: error.message });
  }
});
// Test endpoint - no auth required
router.get('/config-test', (req, res) => {
  // Check environment variables
  const config = {
    stripeKeyExists: !!apiKey,
    webhookSecretExists: !!process.env.STRIPE_WEBHOOK_SECRET,
    priceIDs: {
      premiumMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || 'price_1R4RPCGCjT8uHlI9rBz04dRt',
      premiumYearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || 'price_1R4RZRGCjT8uHlI9gF7Eougo',
      eliteMonthly: process.env.STRIPE_PRICE_ELITE_MONTHLY || 'price_1R4RPzGCjT8uHlI9cG3GqNum',
      eliteYearly: process.env.STRIPE_PRICE_ELITE_YEARLY || 'price_1R4RXGGCjT8uHlI9FP70GX6I'
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
  // Use environment variables with fallback to hardcoded values
  const prices = {
    'premium_month': process.env.STRIPE_PRICE_PREMIUM_MONTHLY || 'price_1R4RPCGCjT8uHlI9rBz04dRt',
    'premium_year': process.env.STRIPE_PRICE_PREMIUM_YEARLY || 'price_1R4RZRGCjT8uHlI9gF7Eougo',
    'elite_month': process.env.STRIPE_PRICE_ELITE_MONTHLY || 'price_1R4RPzGCjT8uHlI9cG3GqNum',
    'elite_year': process.env.STRIPE_PRICE_ELITE_YEARLY || 'price_1R4RXGGCjT8uHlI9FP70GX6I'
  };
  
  const key = `${tier.toLowerCase()}_${interval}`;
  console.log(`Price lookup key: "${key}", Available keys:`, Object.keys(prices));
  console.log(`Price ID found:`, prices[key]);
  
  return prices[key];
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

    // Use the premium monthly price ID directly with fallback
    const priceId = process.env.STRIPE_PRICE_PREMIUM_MONTHLY || 'price_1R4RPCGCjT8uHlI9rBz04dRt';
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
    
    // Create checkout session - FIXED URL (removed the 'S')
    console.log('Simple checkout - creating checkout session');
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `http://localhost:3004/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3004/subscription/cancel`,
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
    const priceId = getPriceIdForTier(tier, interval);
    console.log('Price ID for checkout:', priceId);
    
    if (!priceId) {
      return res.status(400).json({ 
        error: 'Invalid subscription tier or interval',
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
    
    // Create checkout session - FIXED URLs (removed the 'S')
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `http://localhost:3004/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3004/subscription/cancel`,
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
    // Log the API key (first few characters only for security)
    const apiKeyPreview = apiKey.substring(0, 6) + '...';
    console.log('Using Stripe API Key (preview):', apiKeyPreview);

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
      apiKeyProvided: !!apiKey
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

// Add additional functions for subscription management

// Upgrade subscription
router.post('/upgrade-subscription', auth, async (req, res) => {
  try {
    const { tier, interval = 'month', prorationBehavior = 'create_prorations' } = req.body;
    
    // Validate input
    if (!tier || !['premium', 'elite'].includes(tier.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid tier specified' });
    }
    
    if (!['month', 'year'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid billing interval' });
    }
    
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // User must have an existing subscription
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }
    
    // Get the price ID for the new tier
    const priceId = getPriceIdForTier(tier, interval);
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription parameters' });
    }
    
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
    
    // Update the subscription
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
      metadata: {
        tier: tier,
        interval: interval
      },
      proration_behavior: prorationBehavior
    });
    
    // Update user in the database
    user.subscription.tier = tier;
    user.subscription.priceId = priceId;
    await user.save();
    
    res.json({
      success: true,
      message: `Subscription upgraded to ${tier} (${interval})`,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000)
      }
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Upgrade from basic tier
router.post('/upgrade-from-basic', auth, async (req, res) => {
  try {
    const { tier, interval = 'month' } = req.body;
    
    // Validate input
    if (!tier || !['premium', 'elite'].includes(tier.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid tier specified' });
    }
    
    if (!['month', 'year'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid billing interval' });
    }
    
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Ensure user is on basic tier with no active paid subscription
    if (user.subscription && user.subscription.id) {
      return res.status(400).json({ 
        error: 'User already has an active paid subscription',
        message: 'Please use the regular upgrade endpoint instead'
      });
    }
    
    // Get the price ID for the new tier
    const priceId = getPriceIdForTier(tier, interval);
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription parameters' });
    }
    
    // Create Stripe customer if not exists
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        metadata: {
          userId: user._id.toString()
        }
      });
      
      user.stripeCustomerId = customer.id;
      await user.save();
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
      success_url: `http://localhost:3004/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3004/subscription/cancel`,
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
    
    res.json({ 
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Upgrade from basic error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Downgrade to basic (free) tier - takes effect at period end
router.post('/downgrade-to-basic', auth, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Must have an existing subscription
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }
    
    // Get subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
    
    // Mark subscription to cancel at period end
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
      metadata: {
        downgradeToBasic: 'true'
      }
    });
    
    // Update user in database
    user.subscription.cancelAtPeriodEnd = true;
    user.subscription.downgradeToBasic = true;
    await user.save();
    
    // Calculate effective downgrade date
    const effectiveDate = new Date(subscription.current_period_end * 1000);
    
    res.json({
      success: true,
      message: 'Your subscription will be downgraded to Basic at the end of the current billing period.',
      effectiveDate: effectiveDate
    });
  } catch (error) {
    console.error('Downgrade to basic error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Immediately downgrade to basic (free) tier
router.post('/immediate-downgrade-to-basic', auth, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Must have an existing subscription
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }
    
    // Cancel subscription immediately
    await stripe.subscriptions.cancel(user.subscription.id);
    
    // Update user to basic tier
    user.subscription = {
      tier: 'basic',
      status: 'active'
      // Remove subscription ID and other paid details
    };
    await user.save();
    
    // Effective date is now
    const effectiveDate = new Date();
    
    res.json({
      success: true,
      message: 'Your subscription has been canceled and downgraded to Basic immediately.',
      effectiveDate: effectiveDate
    });
  } catch (error) {
    console.error('Immediate downgrade error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Cancel subscription - takes effect at period end
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Must have an existing subscription
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }
    
    // Get subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
    
    // Mark subscription to cancel at period end
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true
    });
    
    // Update user in database
    user.subscription.cancelAtPeriodEnd = true;
    await user.save();
    
    // Calculate effective cancel date
    const effectiveDate = new Date(subscription.current_period_end * 1000);
    
    res.json({
      success: true,
      message: 'Your subscription will be canceled at the end of the current billing period.',
      effectiveDate: effectiveDate
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Cancel subscription immediately
router.post('/cancel-subscription-immediately', auth, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Must have an existing subscription
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }
    
    // Cancel subscription immediately
    await stripe.subscriptions.cancel(user.subscription.id);
    
    // Update user to basic tier
    user.subscription = {
      tier: 'basic',
      status: 'active'
      // Remove subscription ID and other paid details
    };
    await user.save();
    
    // Effective date is now
    const effectiveDate = new Date();
    
    res.json({
      success: true,
      message: 'Your subscription has been canceled immediately.',
      effectiveDate: effectiveDate
    });
  } catch (error) {
    console.error('Immediate cancel error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Calculate proration for changing subscription
router.post('/calculate-proration', auth, async (req, res) => {
  try {
    const { tier, interval = 'month' } = req.body;
    
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // User must have an existing subscription
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }
    
    // Get the price ID for the new tier
    const priceId = getPriceIdForTier(tier, interval);
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription parameters' });
    }
    
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
    const currentItemId = subscription.items.data[0].id;
    
    // Use Stripe to calculate the proration
    const invoicePreview = await stripe.invoices.retrieveUpcoming({
      customer: user.stripeCustomerId,
      subscription: subscription.id,
      subscription_items: [
        {
          id: currentItemId,
          price: priceId
        }
      ],
    });
    
    // Calculate proration amount
    let prorationAmount = 0;
    for (const line of invoicePreview.lines.data) {
      if (line.type === 'invoiceitem' && line.description && line.description.includes('Remaining')) {
        prorationAmount += line.amount;
      }
    }
    
    // Format response
    res.json({
      prorationDetails: {
        immediateCharge: Math.abs(prorationAmount) / 100, // Convert to dollars
        nextBillingAmount: invoicePreview.total / 100, // Convert to dollars
        currency: invoicePreview.currency,
        breakdown: invoicePreview.lines.data.map(line => ({
          description: line.description,
          amount: line.amount / 100,
          period: line.period
        }))
      }
    });
  } catch (error) {
    console.error('Calculate proration error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Reactivate a canceled subscription (if still within cancel_at_period_end state)
router.post('/reactivate-subscription', auth, async (req, res) => {
  try {
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Must have an existing subscription that's set to cancel
    if (!user.subscription || !user.subscription.id || !user.subscription.cancelAtPeriodEnd) {
      return res.status(400).json({ error: 'No subscription pending cancellation found' });
    }
    
    // Remove the cancel_at_period_end flag
    await stripe.subscriptions.update(user.subscription.id, {
      cancel_at_period_end: false,
      metadata: {
        downgradeToBasic: 'false'
      }
    });
    
    // Update user in database
    user.subscription.cancelAtPeriodEnd = false;
    user.subscription.downgradeToBasic = false;
    await user.save();
    
    res.json({
      success: true,
      message: 'Your subscription has been reactivated and will continue at the end of the current billing period.'
    });
  } catch (error) {
    console.error('Reactivate subscription error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Change billing cycle (monthly/yearly)
router.post('/change-billing-cycle', auth, async (req, res) => {
  try {
    const { interval } = req.body;
    
    // Validate input
    if (!interval || !['month', 'year'].includes(interval)) {
      return res.status(400).json({ error: 'Invalid billing interval' });
    }
    
    // Get user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // User must have an existing subscription
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }
    
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
    const currentTier = user.subscription.tier;
    
   // Get the price ID for the current tier but new interval
   const priceId = getPriceIdForTier(currentTier, interval);
   if (!priceId) {
     return res.status(400).json({ error: 'Invalid subscription parameters' });
   }
   
   // Update the subscription
   const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
     items: [
       {
         id: subscription.items.data[0].id,
         price: priceId,
       },
     ],
     metadata: {
       tier: currentTier,
       interval: interval
     },
     proration_behavior: 'create_prorations'
   });
   
   // Update user in the database
   user.subscription.priceId = priceId;
   await user.save();
   
   res.json({
     success: true,
     message: `Billing cycle changed to ${interval === 'month' ? 'monthly' : 'yearly'}`,
     subscription: {
       id: updatedSubscription.id,
       status: updatedSubscription.status,
       currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000)
     }
   });
 } catch (error) {
   console.error('Change billing cycle error:', error);
   res.status(400).json({ error: error.message });
 }
});

/// Complete webhook route handler for server/routes/stripe.js

// Import required libraries at the top of your file


// Configure your webhook route - Note this should be before any other middleware
// that could consume the request body, and it should NOT use the express.json() middleware
router.post('/webhook', 
  express.raw({type: 'application/json'}), 
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // Enhanced logging for debugging
    console.log('⚡ WEBHOOK RECEIVED ⚡');
    console.log('Headers:', JSON.stringify(req.headers));
    console.log('Body size:', req.body.length);
    console.log('Signature exists:', !!sig);
    console.log('Webhook secret exists:', !!webhookSecret);

    // Verify webhook signature
    let event;
    try {
      if (webhookSecret) {
        // If we have a webhook secret, verify the signature
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        console.log('✅ Webhook signature verified successfully');
      } else {
        // For development - parse the body and log a warning
        console.warn('⚠️ WEBHOOK SECRET MISSING - SECURITY RISK IN PRODUCTION ⚠️');
        event = JSON.parse(req.body.toString());
      }
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      console.error('Request body sample:', req.body.toString().substring(0, 100) + '...');
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Log the event type and ID
    console.log(`🔔 Event received: ${event.type} (${event.id})`);
    
    // Handle different event types
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await handleCheckoutSessionCompleted(event.data.object);
          break;
          
        case 'customer.subscription.created':
          await handleSubscriptionCreated(event.data.object);
          break;
          
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object);
          break;
          
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object);
          break;
          
        case 'invoice.payment_succeeded':
          await handleInvoicePaymentSucceeded(event.data.object);
          break;
          
        case 'invoice.payment_failed':
          await handleInvoicePaymentFailed(event.data.object);
          break;
          
        default:
          console.log(`⏩ Unhandled event type: ${event.type}`);
      }
      
      // Return success response
      res.json({ received: true, eventId: event.id });
    } catch (err) {
      console.error(`❌ Error handling webhook event ${event.type}:`, err);
      console.error('Stack trace:', err.stack);
      res.status(500).send(`Webhook processing error: ${err.message}`);
    }
});

// Handler for checkout.session.completed event
async function handleCheckoutSessionCompleted(session) {
  console.log('🛒 Processing checkout.session.completed:', session.id);
  console.log('Session details:', {
    customer: session.customer,
    subscription: session.subscription,
    paymentStatus: session.payment_status,
    metadata: session.metadata
  });
  
  // Skip if not a successful payment
  if (session.payment_status !== 'paid') {
    console.log(`⚠️ Session ${session.id} payment status is not 'paid', skipping`);
    return;
  }
  
  // Extract the subscription from the session
  const subscriptionId = session.subscription;
  
  if (!subscriptionId) {
    console.log('❌ No subscription ID found in checkout session');
    return;
  }
  
  // Get additional data from metadata
  const userId = session.metadata?.userId;
  const tier = session.metadata?.tier || 'premium'; // Default to premium if not specified
  
  if (!userId) {
    console.error('❌ No user ID found in checkout session metadata');
    return;
  }
  
  try {
    // Get subscription details from Stripe
    console.log(`🔍 Retrieving subscription ${subscriptionId} from Stripe`);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    // Get user from database
    console.log(`🔍 Finding user with ID ${userId}`);
    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found for ID:', userId);
      return;
    }
    
    console.log('📝 Updating user subscription data');
    console.log('Current user subscription:', user.subscription);
    
    // Update user's subscription in database
    user.subscription = {
      id: subscriptionId,
      status: subscription.status,
      tier: tier,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    };
    
    await user.save();
    console.log(`✅ Subscription ${subscriptionId} activated for user ${userId}`);
    console.log('Updated subscription data:', user.subscription);
  } catch (error) {
    console.error('❌ Error processing checkout session completion:', error);
    console.error('Stack trace:', error.stack);
    throw error; // Rethrow to be handled by the webhook handler
  }
}

// Handler for customer.subscription.created event
async function handleSubscriptionCreated(subscription) {
  console.log('➕ Processing subscription.created:', subscription.id);
  
  // Get the customer ID from the subscription
  const customerId = subscription.customer;
  
  try {
    // Find user with this Stripe customer ID
    console.log(`🔍 Finding user with Stripe customer ID ${customerId}`);
    const user = await User.findOne({ stripeCustomerId: customerId });
    if (!user) {
      console.error('❌ No user found with Stripe customer ID:', customerId);
      return;
    }
    
    // Determine subscription tier from price or metadata
    const priceId = subscription.items.data[0].price.id;
    console.log(`Price ID from subscription: ${priceId}`);
    let tier = 'premium'; // Default
    
    // Map price ID to tier based on metadata or price ID
    if (subscription.metadata?.tier) {
      tier = subscription.metadata.tier;
      console.log(`Using tier from metadata: ${tier}`);
    } else if (priceId.includes('elite')) {
      tier = 'elite';
      console.log(`Determined tier 'elite' from price ID`);
    } else if (priceId.includes('premium')) {
      tier = 'premium';
      console.log(`Determined tier 'premium' from price ID`);
    }
    
    // Update user's subscription
    console.log('📝 Updating user subscription data');
    console.log('Current user subscription:', user.subscription);
    
    user.subscription = {
      id: subscription.id,
      status: subscription.status,
      tier: tier,
      priceId: priceId,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    };
    
    await user.save();
    console.log(`✅ Subscription ${subscription.id} created for user ${user._id}`);
    console.log('Updated subscription data:', user.subscription);
  } catch (error) {
    console.error('❌ Error processing subscription creation:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Handler for customer.subscription.updated event
async function handleSubscriptionUpdated(subscription) {
  console.log('🔄 Processing subscription.updated:', subscription.id);
  
  try {
    // Find user with this subscription ID
    console.log(`🔍 Finding user with subscription ID ${subscription.id}`);
    const user = await User.findOne({ 'subscription.id': subscription.id });
    if (!user) {
      console.error('❌ No user found with subscription ID:', subscription.id);
      return;
    }
    
    console.log('📝 Updating user subscription data');
    console.log('Current user subscription:', user.subscription);
    
    // Update user's subscription status
    user.subscription.status = subscription.status;
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
    
    // Check if tier changed (price changed)
    const newPriceId = subscription.items.data[0].price.id;
    if (user.subscription.priceId !== newPriceId) {
      user.subscription.priceId = newPriceId;
      console.log(`Price ID changed to: ${newPriceId}`);
      
      // Determine new tier from price or metadata
      if (subscription.metadata?.tier) {
        user.subscription.tier = subscription.metadata.tier;
        console.log(`Using tier from metadata: ${subscription.metadata.tier}`);
      } else if (newPriceId.includes('elite')) {
        user.subscription.tier = 'elite';
        console.log(`Determined tier 'elite' from price ID`);
      } else if (newPriceId.includes('premium')) {
        user.subscription.tier = 'premium';
        console.log(`Determined tier 'premium' from price ID`);
      }
    }
    
    await user.save();
    console.log(`✅ Subscription ${subscription.id} updated for user ${user._id}`);
    console.log('Updated subscription data:', user.subscription);
  } catch (error) {
    console.error('❌ Error processing subscription update:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Handler for customer.subscription.deleted event
async function handleSubscriptionDeleted(subscription) {
  console.log('❌ Processing subscription.deleted:', subscription.id);
  
  try {
    // Find user with this subscription ID
    console.log(`🔍 Finding user with subscription ID ${subscription.id}`);
    const user = await User.findOne({ 'subscription.id': subscription.id });
    if (!user) {
      console.error('❌ No user found with subscription ID:', subscription.id);
      return;
    }
    
    console.log('📝 Resetting user to basic tier');
    console.log('Current user subscription:', user.subscription);
    
    // Reset to basic tier
    user.subscription = {
      tier: 'basic',
      status: 'active',
      // Remove subscription ID and other paid details
    };
    
    await user.save();
    console.log(`✅ Subscription ${subscription.id} deleted, user ${user._id} reset to basic tier`);
    console.log('Updated subscription data:', user.subscription);
  } catch (error) {
    console.error('❌ Error processing subscription deletion:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Handler for invoice.payment_succeeded event
async function handleInvoicePaymentSucceeded(invoice) {
  console.log('💰 Processing invoice.payment_succeeded:', invoice.id);
  
  // Only process subscription invoices
  if (!invoice.subscription) {
    console.log('⏩ Not a subscription invoice, ignoring');
    return;
  }
  
  try {
    // Get subscription details
    console.log(`🔍 Retrieving subscription ${invoice.subscription} from Stripe`);
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    
    // Find user with this subscription ID
    console.log(`🔍 Finding user with subscription ID ${invoice.subscription}`);
    const user = await User.findOne({ 'subscription.id': invoice.subscription });
    if (!user) {
      console.error('❌ No user found with subscription ID:', invoice.subscription);
      return;
    }
    
    console.log('📝 Checking if subscription needs to be reactivated');
    console.log('Current user subscription:', user.subscription);
    
    // Update subscription status to active if it was past_due
    if (user.subscription.status === 'past_due') {
      user.subscription.status = 'active';
      await user.save();
      console.log(`✅ Subscription ${invoice.subscription} reactivated for user ${user._id}`);
      console.log('Updated subscription data:', user.subscription);
    } else {
      console.log('⏩ Subscription already active, no update needed');
    }
  } catch (error) {
    console.error('❌ Error processing invoice payment success:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Handler for invoice.payment_failed event
async function handleInvoicePaymentFailed(invoice) {
  console.log('⚠️ Processing invoice.payment_failed:', invoice.id);
  
  if (!invoice.subscription) {
    console.log('⏩ Not a subscription invoice, ignoring');
    return;
  }
  
  try {
    // Find user with this subscription ID
    console.log(`🔍 Finding user with subscription ID ${invoice.subscription}`);
    const user = await User.findOne({ 'subscription.id': invoice.subscription });
    if (!user) {
      console.error('❌ No user found with subscription ID:', invoice.subscription);
      return;
    }
    
    console.log('📝 Updating subscription status to past_due');
    console.log('Current user subscription:', user.subscription);
    
    // Update subscription status to past_due
    user.subscription.status = 'past_due';
    await user.save();
    console.log(`✅ Subscription ${invoice.subscription} marked as past_due for user ${user._id}`);
    console.log('Updated subscription data:', user.subscription);
  } catch (error) {
    console.error('❌ Error processing invoice payment failure:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  }
}

// Route to get payment methods for a user
router.get('/payment-methods', auth, async (req, res) => {
 try {
   const user = await User.findById(req.user.id);
   if (!user) {
     return res.status(404).json({ error: 'User not found' });
   }

   if (!user.stripeCustomerId) {
     return res.json({ paymentMethods: [] });
   }

   const paymentMethods = await stripe.paymentMethods.list({
     customer: user.stripeCustomerId,
     type: 'card',
   });

   res.json({ paymentMethods: paymentMethods.data });
 } catch (error) {
   console.error('Payment methods error:', error);
   res.status(400).json({ error: error.message });
 }
});

// Test webhook endpoint
router.get('/test-webhook', async (req, res) => {
 try {
   // Check if webhook secret is configured
   const webhookSecretExists = !!process.env.STRIPE_WEBHOOK_SECRET;
   
   res.json({
     status: 'ok',
     webhookSecretExists,
     message: webhookSecretExists 
       ? 'Webhook secret is configured' 
       : 'WARNING: Webhook secret is not configured'
   });
 } catch (error) {
   console.error('Webhook test error:', error);
   res.status(500).json({ error: error.message });
 }
});

// Export the router
module.exports = router;