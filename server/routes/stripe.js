// server/routes/stripe.js - Modified to handle free Basic tier

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const User = require('../models/User');
const emailService = require('../services/email');

// Helper function to determine price ID based on tier
function getPriceIdForTier(tier) {
  // Basic tier is free, so no price ID needed
  if (tier.toLowerCase() === 'basic') {
    return null;
  }
  
  // Map subscription tiers to Stripe Price IDs
  // Replace these with your actual Stripe Price IDs
  const prices = {
    'premium': process.env.STRIPE_PRICE_PREMIUM,
    'elite': process.env.STRIPE_PRICE_ELITE
  };
  
  return prices[tier.toLowerCase()];
}

// Handle Basic (free) tier signup - no Stripe needed
router.post('/signup-basic', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Update user's subscription to Basic tier
    user.subscription = {
      tier: 'basic',
      status: 'active',
      // No Stripe subscription ID for free tier
    };
    
    await user.save();
    
    // Send welcome email for basic tier
    await emailService.sendSubscriptionWelcomeEmail(user.email, {
      firstName: user.firstName,
      tier: 'basic'
    });
    
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
    const { tier } = req.body;
    
    // If trying to checkout for Basic tier, redirect to the free signup
    if (tier.toLowerCase() === 'basic') {
      return res.json({ 
        isFree: true,
        redirectTo: '/api/stripe/signup-basic' 
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Get price ID for the selected tier
    const priceId = getPriceIdForTier(tier);
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription tier' });
    }
    
    // Create Stripe customer if not exists
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
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
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: user._id.toString(),
        tier: tier
      },
    });
    
    res.json({ 
      isFree: false,
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Upgrade existing subscription
router.post('/upgrade-subscription', auth, async (req, res) => {
  try {
    const { tier } = req.body;
    const user = await User.findById(req.user.id);
    
    // Ensure user has a subscription
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ 
        error: 'No subscription found for this user',
        redirectTo: '/api/stripe/upgrade-from-basic'
      });
    }
    
    // Get price ID for the selected tier
    const priceId = getPriceIdForTier(tier);
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription tier' });
    }
    
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
    
    // Update the subscription with new price
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
      proration_behavior: 'create_prorations',
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }],
      metadata: {
        tier: tier
      }
    });
    
    // Update user's subscription in database
    user.subscription.tier = tier;
    user.subscription.priceId = priceId;
    await user.save();
    
    // Send confirmation email
    await emailService.sendSubscriptionUpgradeEmail(user.email, {
      firstName: user.firstName,
      tier: tier
    });
    
    res.json({ success: true, message: `Subscription upgraded to ${tier}` });
  } catch (error) {
    console.error('Subscription upgrade error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Downgrade to Basic (free) tier
router.post('/downgrade-to-basic', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // If user doesn't have a paid subscription, nothing to do
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No paid subscription found to downgrade' });
    }
    
    // Cancel the current subscription at period end
    await stripe.subscriptions.update(user.subscription.id, {
      cancel_at_period_end: true
    });
    
    // Update user's subscription status
    user.subscription.cancelAtPeriodEnd = true;
    user.subscription.downgradeToBasic = true; // Flag to indicate downgrade to basic
    await user.save();
    
    // Send downgrade email
    await emailService.sendSubscriptionDowngradeEmail(user.email, {
      firstName: user.firstName,
      currentTier: user.subscription.tier,
      endDate: new Date(user.subscription.currentPeriodEnd)
    });
    
    res.json({ 
      success: true, 
      message: 'Your subscription will be downgraded to the free Basic plan at the end of your billing period' 
    });
  } catch (error) {
    console.error('Downgrade error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Upgrade from free Basic tier to paid tier
router.post('/upgrade-from-basic', auth, async (req, res) => {
  try {
    const { tier } = req.body;
    const user = await User.findById(req.user.id);
    
    // Verify user is on Basic tier
    if (user.subscription && 
        user.subscription.tier !== 'basic' && 
        user.subscription.id) {
      return res.status(400).json({ 
        error: 'Cannot use this endpoint to upgrade from a paid tier',
        redirectTo: '/api/stripe/upgrade-subscription'
      });
    }
    
    // Get price ID for the selected tier
    const priceId = getPriceIdForTier(tier);
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription tier' });
    }
    
    // Create or use existing Stripe customer
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user._id.toString()
        }
      });
      
      user.stripeCustomerId = customer.id;
      await user.save();
    }
    
    // Create checkout session for the upgrade
    const session = await stripe.checkout.sessions.create({
      customer: user.stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: user._id.toString(),
        tier: tier,
        upgradeFromBasic: 'true'
      },
    });
    
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Upgrade from basic error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/cancel-subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No subscription found for this user' });
    }
    
    // Cancel at period end rather than immediately
    await stripe.subscriptions.update(user.subscription.id, {
      cancel_at_period_end: true
    });
    
    // Update local subscription status
    user.subscription.cancelAtPeriodEnd = true;
    await user.save();
    
    // Send cancellation email
    await emailService.sendSubscriptionCancellationEmail(user.email, {
      firstName: user.firstName
    });
    
    res.json({ success: true, message: 'Subscription will be canceled at the end of the billing period' });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Retrieve subscription details
router.get('/subscription', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
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
      // Get the latest subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
      
      // Format the response
      const response = {
        hasSubscription: true,
        status: subscription.status,
        tier: user.subscription.tier,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        isFree: false,
        downgradeToBasic: user.subscription.downgradeToBasic || false
      };
      
      return res.json(response);
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

// Webhook handler for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event based on its type
  switch (event.type) {
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object);
      break;
    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}`);
  }
  
  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

// Handle subscription created event
async function handleSubscriptionCreated(subscription) {
  try {
    // Find user by Stripe customer ID
    const user = await User.findOne({ 
      stripeCustomerId: subscription.customer 
    });
    
    if (!user) {
      throw new Error('User not found for subscription');
    }
    
    // Determine tier from metadata or price ID
    let tier = subscription.metadata.tier || 'basic';
    
    // Update user's subscription details
    user.subscription = {
      id: subscription.id,
      status: subscription.status,
      tier: tier,
      priceId: subscription.items.data[0].price.id,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    };
    
    await user.save();
    
    // Send welcome email
    await emailService.sendSubscriptionWelcomeEmail(user.email, {
      firstName: user.firstName,
      tier: tier
    });
  } catch (error) {
    console.error('Error handling subscription created event:', error);
  }
}

// Handle subscription updated event
async function handleSubscriptionUpdated(subscription) {
  try {
    // Find user by subscription ID
    const user = await User.findOne({ 
      'subscription.id': subscription.id 
    });
    
    if (!user) {
      throw new Error('User not found for subscription');
    }
    
    // Determine tier from metadata or existing tier
    let tier = subscription.metadata.tier || user.subscription.tier;
    
    // Update subscription details
    user.subscription.status = subscription.status;
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
    
    if (subscription.status === 'active' && user.subscription.status !== 'active') {
      // Send reactivation email if subscription was previously inactive
      await emailService.sendSubscriptionReactivatedEmail(user.email, {
        firstName: user.firstName,
        tier: tier
      });
    }
    
    await user.save();
  } catch (error) {
    console.error('Error handling subscription updated event:', error);
  }
}

// Handle subscription deleted event
async function handleSubscriptionDeleted(subscription) {
  try {
    // Find user by subscription ID
    const user = await User.findOne({ 
      'subscription.id': subscription.id 
    });
    
    if (!user) {
      throw new Error('User not found for subscription');
    }
    
    // If this was a downgrade to basic, set to basic tier
    // Otherwise just set to canceled
    if (user.subscription.downgradeToBasic) {
      user.subscription = {
        tier: 'basic',
        status: 'active'
      };
      
      // Send downgrade complete email
      await emailService.sendSubscriptionDowngradeCompleteEmail(user.email, {
        firstName: user.firstName
      });
    } else {
      user.subscription = {
        tier: 'basic', // Default to basic tier when subscription ends
        status: 'canceled'
      };
      
      // Send subscription ended email
      await emailService.sendSubscriptionEndedEmail(user.email, {
        firstName: user.firstName
      });
    }
    
    await user.save();
  } catch (error) {
    console.error('Error handling subscription deleted event:', error);
  }
}

// Handle payment failed event
async function handlePaymentFailed(invoice) {
  try {
    // Find user by customer ID
    const user = await User.findOne({ 
      stripeCustomerId: invoice.customer 
    });
    
    if (!user) {
      throw new Error('User not found for invoice');
    }
    
    // Send payment failed email
    await emailService.sendPaymentFailedEmail(user.email, {
      firstName: user.firstName,
      amount: invoice.amount_due / 100, // Convert from cents
      nextAttemptDate: new Date(invoice.next_payment_attempt * 1000)
    });
  } catch (error) {
    console.error('Error handling payment failed event:', error);
  }
}

module.exports = router;