// server/routes/stripe.js - Enhanced with proration and improved subscription handling

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require('../middleware/auth');
const User = require('../models/User');
const emailService = require('../services/email');

// Helper function to determine price ID based on tier
function getPriceIdForTier(tier, interval = 'month') {
  // Basic tier is free, so no price ID needed
  if (tier.toLowerCase() === 'basic') {
    return null;
  }
  
  // Map subscription tiers to Stripe Price IDs
  // Replace these with your actual Stripe Price IDs
  const prices = {
    'premium_month': process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    'premium_year': process.env.STRIPE_PRICE_PREMIUM_YEARLY,
    'elite_month': process.env.STRIPE_PRICE_ELITE_MONTHLY,
    'elite_year': process.env.STRIPE_PRICE_ELITE_YEARLY
  };
  
  return prices[`${tier.toLowerCase()}_${interval}`];
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
    const { tier, interval = 'month' } = req.body;
    
    // If trying to checkout for Basic tier, redirect to the free signup
    if (tier.toLowerCase() === 'basic') {
      return res.json({ 
        isFree: true,
        redirectTo: '/api/stripe/signup-basic' 
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Get price ID for the selected tier and interval
    const priceId = getPriceIdForTier(tier, interval);
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription tier or interval' });
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
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
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
      isFree: false,
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Checkout session error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Calculate proration for changing subscription
router.post('/calculate-proration', auth, async (req, res) => {
  try {
    const { tier, interval = 'month' } = req.body;
    const user = await User.findById(req.user.id);
    
    // Ensure user has a subscription
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No subscription found for this user' });
    }
    
    // Get price ID for the selected tier
    const priceId = getPriceIdForTier(tier, interval);
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription tier or interval' });
    }
    
    // Get the subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
    
    // Calculate proration by creating an invoice preview
    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: user.stripeCustomerId,
      subscription: subscription.id,
      subscription_items: [{
        id: subscription.items.data[0].id,
        price: priceId
      }],
      subscription_proration_date: Math.floor(Date.now() / 1000)
    });
    
    // Find the prorated amount on the invoice
    let proratedCharge = 0;
    for (const item of invoice.lines.data) {
      if (item.proration) {
        proratedCharge += item.amount;
      }
    }
    
    // Return proration details
    res.json({
      prorationDate: Math.floor(Date.now() / 1000),
      immediateCharge: proratedCharge,
      nextBillingAmount: invoice.total,
      nextBillingDate: new Date(subscription.current_period_end * 1000).toISOString(),
      currency: invoice.currency
    });
  } catch (error) {
    console.error('Proration calculation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Upgrade existing subscription
router.post('/upgrade-subscription', auth, async (req, res) => {
  try {
    const { tier, interval = 'month', prorationBehavior = 'create_prorations' } = req.body;
    const user = await User.findById(req.user.id);
    
    // Ensure user has a subscription
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ 
        error: 'No subscription found for this user',
        redirectTo: '/api/stripe/upgrade-from-basic'
      });
    }
    
    // Get price ID for the selected tier
    const priceId = getPriceIdForTier(tier, interval);
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription tier or interval' });
    }
    
    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(user.subscription.id);
    
    // Update the subscription with new price
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
      proration_behavior: prorationBehavior,
      items: [{
        id: subscription.items.data[0].id,
        price: priceId,
      }],
      metadata: {
        tier: tier,
        interval: interval,
        updatedAt: new Date().toISOString()
      }
    });
    
    // Update user's subscription in database
    user.subscription.tier = tier;
    user.subscription.priceId = priceId;
    user.subscription.interval = interval;
    user.subscription.currentPeriodEnd = new Date(updatedSubscription.current_period_end * 1000);
    user.subscription.cancelAtPeriodEnd = updatedSubscription.cancel_at_period_end;
    await user.save();
    
    // Send confirmation email
    await emailService.sendSubscriptionChangeEmail(user.email, {
      firstName: user.firstName,
      tier: tier,
      isUpgrade: true,
      effectiveDate: 'immediately',
      nextBillingDate: new Date(updatedSubscription.current_period_end * 1000)
    });
    
    res.json({ 
      success: true, 
      message: `Subscription changed to ${tier} (${interval})` 
    });
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
      cancel_at_period_end: true,
      metadata: {
        downgradeToBasic: 'true',
        downgradeRequestedAt: new Date().toISOString()
      }
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
      message: 'Your subscription will be downgraded to the free Basic plan at the end of your billing period',
      effectiveDate: new Date(user.subscription.currentPeriodEnd).toISOString()
    });
  } catch (error) {
    console.error('Downgrade error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Immediate downgrade to Basic (free) tier with refund
router.post('/immediate-downgrade-to-basic', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // If user doesn't have a paid subscription, nothing to do
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No paid subscription found to downgrade' });
    }
    
    // Cancel the subscription immediately
    const subscription = await stripe.subscriptions.del(user.subscription.id, {
      prorate: true, // Provide prorated credit
    });
    
    // Update user's subscription
    user.subscription = {
      tier: 'basic',
      status: 'active',
      downgradeFromPaidTier: true,
      previousTier: user.subscription.tier,
      downgradeDate: new Date()
    };
    await user.save();
    
    // Send downgrade email
    await emailService.sendSubscriptionImmediateDowngradeEmail(user.email, {
      firstName: user.firstName,
      previousTier: subscription.metadata.tier || 'paid',
      refundAmount: subscription.status === 'canceled' ? 'prorated amount' : 'none'
    });
    
    res.json({ 
      success: true, 
      message: 'Your subscription has been downgraded to the free Basic plan immediately',
      effectiveDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Immediate downgrade error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Upgrade from free Basic tier to paid tier
router.post('/upgrade-from-basic', auth, async (req, res) => {
  try {
    const { tier, interval = 'month' } = req.body;
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
    const priceId = getPriceIdForTier(tier, interval);
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid subscription tier or interval' });
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
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
      metadata: {
        userId: user._id.toString(),
        tier: tier,
        interval: interval,
        upgradeFromBasic: 'true'
      },
      subscription_data: {
        metadata: {
          tier: tier,
          interval: interval,
          upgradeFromBasic: 'true'
        }
      }
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
      cancel_at_period_end: true,
      metadata: {
        cancelRequestedAt: new Date().toISOString()
      }
    });
    
    // Update local subscription status
    user.subscription.cancelAtPeriodEnd = true;
    await user.save();
    
    // Send cancellation email
    await emailService.sendSubscriptionCancellationEmail(user.email, {
      firstName: user.firstName,
      effectiveDate: new Date(user.subscription.currentPeriodEnd),
      tier: user.subscription.tier
    });
    
    res.json({ 
      success: true, 
      message: 'Subscription will be canceled at the end of the billing period',
      effectiveDate: new Date(user.subscription.currentPeriodEnd).toISOString()
    });
  } catch (error) {
    console.error('Subscription cancellation error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Immediate subscription cancellation with potential refund
router.post('/cancel-subscription-immediately', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.subscription || !user.subscription.id) {
      return res.status(400).json({ error: 'No subscription found for this user' });
    }
    
    // Cancel the subscription immediately
    const canceledSubscription = await stripe.subscriptions.del(user.subscription.id, {
      prorate: true // Issue a prorated refund
    });
    
    // Update user's subscription
    user.subscription = {
      tier: 'basic', // Default to basic tier when subscription is canceled
      status: 'canceled',
      cancelDate: new Date(),
      previousTier: user.subscription.tier
    };
    await user.save();
    
    // Send immediate cancellation email
    await emailService.sendImmediateCancellationEmail(user.email, {
      firstName: user.firstName,
      prorationApplied: true
    });
    
    res.json({ 
      success: true, 
      message: 'Your subscription has been canceled immediately, and a prorated refund will be issued.',
      effectiveDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Immediate subscription cancellation error:', error);
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
    case 'invoice.payment_succeeded':
      await handlePaymentSucceeded(event.data.object);
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
    let interval = subscription.metadata.interval || 'month';
    
    // Update user's subscription details
    user.subscription = {
      id: subscription.id,
      status: subscription.status,
      tier: tier,
      interval: interval,
      priceId: subscription.items.data[0].price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    };
    
    await user.save();
    
    // Send welcome email
    await emailService.sendSubscriptionWelcomeEmail(user.email, {
      firstName: user.firstName,
      tier: tier,
      interval: interval,
      amount: (subscription.items.data[0].price.unit_amount / 100).toFixed(2),
      currency: subscription.items.data[0].price.currency
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
    
    // Get the previous subscription status for comparison
    const previousStatus = user.subscription.status;
    const previousTier = user.subscription.tier;
    
    // Determine tier and interval from metadata or existing tier
    let tier = subscription.metadata.tier || user.subscription.tier;
    let interval = subscription.metadata.interval || user.subscription.interval || 'month';
    
    // Update subscription details
    user.subscription.status = subscription.status;
    user.subscription.tier = tier;
    user.subscription.interval = interval;
    user.subscription.currentPeriodStart = new Date(subscription.current_period_start * 1000);
    user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
    user.subscription.cancelAtPeriodEnd = subscription.cancel_at_period_end;
    
    // If cancellation is no longer pending, update flag
    if (!subscription.cancel_at_period_end && user.subscription.cancelAtPeriodEnd) {
      user.subscription.cancelAtPeriodEnd = false;
      
      // Send subscription renewed email if it was previously set to cancel
      await emailService.sendSubscriptionRenewalEmail(user.email, {
        firstName: user.firstName,
        tier: tier,
        nextBillingDate: new Date(subscription.current_period_end * 1000)
      });
    }
    
    // If tier has changed, send notification
    if (previousTier !== tier) {
      await emailService.sendSubscriptionTierChangedEmail(user.email, {
        firstName: user.firstName,
        previousTier: previousTier,
        newTier: tier,
        effectiveDate: new Date(),
        nextBillingDate: new Date(subscription.current_period_end * 1000)
      });
    }
    
    // If subscription was inactive and is now active
    if (previousStatus !== 'active' && subscription.status === 'active') {
      // Send reactivation email
      await emailService.sendSubscriptionReactivatedEmail(user.email, {
        firstName: user.firstName,
        tier: tier,
        interval: interval,
        nextBillingDate: new Date(subscription.current_period_end * 1000)
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
        status: 'active',
        previousTier: user.subscription.tier,
        downgradeDate: new Date()
      };
      
      // Send downgrade complete email
      await emailService.sendSubscriptionDowngradeCompleteEmail(user.email, {
        firstName: user.firstName,
        previousTier: user.subscription.previousTier
      });
    } else {
      user.subscription = {
        tier: 'basic', // Default to basic tier when subscription ends
        status: 'canceled',
        previousTier: user.subscription.tier,
        cancelDate: new Date()
      };
      
      // Send subscription ended email
      await emailService.sendSubscriptionEndedEmail(user.email, {
        firstName: user.firstName,
        previousTier: user.subscription.previousTier
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
      currency: invoice.currency,
      nextAttemptDate: invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000) : null,
      invoiceUrl: invoice.hosted_invoice_url
    });
    
    // Update user's subscription status to reflect payment issue
    if (user.subscription && user.subscription.id) {
      user.subscription.paymentFailed = true;
      user.subscription.lastPaymentFailure = new Date();
      await user.save();
    }
  } catch (error) {
    console.error('Error handling payment failed event:', error);
  }
}

// Handle payment succeeded event
async function handlePaymentSucceeded(invoice) {
  try {
    // Find user by customer ID
    const user = await User.findOne({ 
      stripeCustomerId: invoice.customer 
    });
    
    if (!user) {
      throw new Error('User not found for invoice');
    }
    
    // If this payment is related to a subscription
    if (invoice.subscription) {
      // Reset payment failure flags if they were set
      if (user.subscription && user.subscription.paymentFailed) {
        user.subscription.paymentFailed = false;
        user.subscription.lastPaymentSuccess = new Date();
        await user.save();
        
        // Send payment recovery email if there was a previous failure
        await emailService.sendPaymentRecoveredEmail(user.email, {
          firstName: user.firstName,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          invoiceUrl: invoice.hosted_invoice_url,
          tier: user.subscription.tier
        });
      } else {
        // Send regular payment receipt
        await emailService.sendPaymentReceiptEmail(user.email, {
          firstName: user.firstName,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          invoiceUrl: invoice.hosted_invoice_url,
          billingPeriod: `${new Date(invoice.period_start * 1000).toLocaleDateString()} to ${new Date(invoice.period_end * 1000).toLocaleDateString()}`,
          tier: user.subscription.tier
        });
      }
    }
  } catch (error) {
    console.error('Error handling payment succeeded event:', error);
  }
}

module.exports = router;