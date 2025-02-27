const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

// Make sure environment variables are loaded
dotenv.config();

// Initialize Stripe with proper error handling
let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Warning: STRIPE_SECRET_KEY is not set in environment variables');
    // Create a mock Stripe for development without real API keys
    stripe = {
      customers: {
        create: () => Promise.resolve({ id: 'mock_customer_id' }),
        list: () => Promise.resolve({ data: [] })
      },
      subscriptions: {
        list: () => Promise.resolve({ data: [] }),
        update: () => Promise.resolve({ id: 'mock_subscription_id', status: 'active' })
      },
      checkout: {
        sessions: {
          create: () => Promise.resolve({ id: 'mock_session_id' }),
          retrieve: () => Promise.resolve({ 
            id: 'mock_session_id',
            metadata: { userId: '1234', planId: 'basic' },
            subscription: {
              id: 'mock_subscription_id',
              status: 'active',
              current_period_end: Math.floor(Date.now()/1000) + 30*24*60*60,
              cancel_at_period_end: false
            }
          })
        }
      },
      prices: {
        retrieve: () => Promise.resolve({ 
          id: 'mock_price_id',
          unit_amount: 1999,
          currency: 'usd',
          recurring: { interval: 'month' },
          product: {
            id: 'prod_premium',
            name: 'Premium Plan'
          }
        })
      },
      subscriptionItems: {
        list: () => Promise.resolve({ data: [{ price: { id: 'mock_price_id' } }] })
      },
      webhooks: {
        constructEvent: () => ({ type: 'mock_event', data: { object: {} } })
      }
    };
  } else {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (error) {
  console.error('Error initializing Stripe:', error);
  stripe = null;
}

const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Create a Stripe checkout session
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const { priceId, planName, planId } = req.body;
    const userId = req.user.id;
    
    // Get user from database
    const user = User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Create a customer in Stripe if not exists
    let customerId = user.stripeCustomerId;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id
        }
      });
      
      customerId = customer.id;
      
      // Save the Stripe customer ID to your database
      user.stripeCustomerId = customerId;
      user.save();
    }
    
    // Create the session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscription/cancel`,
      metadata: {
        userId: user.id,
        planId: planId,
        planName: planName
      }
    });
    
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get subscription status
router.get('/subscription-status', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user from database
    const user = User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user has a free basic subscription
    if (user.subscription && user.subscription.isFree && user.subscription.planLevel === 'basic') {
      return res.status(200).json({
        status: 'basic',
        details: {
          planLevel: 'basic',
          planName: 'Basic',
          status: 'active',
          isFree: true,
          startDate: user.subscription.startDate,
          currentPeriodEnd: user.subscription.currentPeriodEnd || new Date(2099, 11, 31)
        }
      });
    }
    
    // Otherwise check for paid subscriptions via Stripe
    if (!user.stripeCustomerId) {
      return res.status(200).json({ 
        status: 'none',
        details: null
      });
    }
    
    // Get subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      expand: ['data.default_payment_method']
    });
    
    if (subscriptions.data.length === 0) {
      return res.status(200).json({ 
        status: 'none',
        details: null
      });
    }
    
    // Get the current subscription
    const subscription = subscriptions.data[0];
    
    // Map Stripe products to our subscription levels
    const productToPlan = {
      'prod_basic': 'basic',
      'prod_premium': 'premium',
      'prod_elite': 'elite'
    };
    
    // Get the product ID from the subscription
    const priceId = subscription.items.data[0].price.id;
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product']
    });
    
    const productId = price.product.id;
    const planLevel = productToPlan[productId] || 'basic';
    
    // Get subscription details
    const details = {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      planName: price.product.name,
      planLevel: planLevel,
      priceId: priceId,
      amount: price.unit_amount / 100,
      currency: price.currency,
      interval: price.recurring.interval,
      isFree: false
    };
    
    // Save updated subscription info to user
    user.subscription = {
      stripeSubscriptionId: subscription.id,
      planLevel: planLevel,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      isFree: false
    };
    
    user.save();
    
    res.status(200).json({
      status: planLevel,
      details: details
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify subscription payment
router.post('/verify-subscription', authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;
    
    // Get checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'subscription.default_payment_method']
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Verify that this checkout session is for this user
    if (session.metadata.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Map Stripe products to our subscription levels
    const planId = session.metadata.planId;
    let status;
    
    if (planId.includes('basic')) {
      status = 'basic';
    } else if (planId.includes('premium')) {
      status = 'premium';
    } else if (planId.includes('elite')) {
      status = 'elite';
    } else {
      status = 'basic'; // Default fallback
    }
    
    // Get subscription details from session
    const subscription = session.subscription;
    
    // Update user in database
    const user = User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.subscription = {
      stripeSubscriptionId: subscription.id,
      planLevel: status,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      isFree: false
    };
    
    user.save();
    
    // Return subscription details
    const details = {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      planName: session.metadata.planName,
      planLevel: status,
      isFree: false
    };
    
    res.status(200).json({
      status: status,
      details: details
    });
  } catch (error) {
    console.error('Error verifying subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/cancel-subscription', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user from database
    const user = User.findById(userId);
    
    if (!user || !user.subscription || !user.subscription.stripeSubscriptionId) {
      return res.status(404).json({ error: 'No active subscription found' });
    }
    
    const subscriptionId = user.subscription.stripeSubscriptionId;
    
    // Cancel at period end (user will still have access until subscription expires)
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    
    // Update user in database
    user.subscription.cancelAtPeriodEnd = true;
    user.save();
    
    res.status(200).json({
      canceledAt: new Date(),
      activeUntil: new Date(subscription.current_period_end * 1000)
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle subscription events from Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  let event;
  
  try {
    const signature = req.headers['stripe-signature'];
    
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test'
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      await handleSubscriptionChange(subscription);
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      await handleInvoicePayment(invoice);
      break;
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      await handleFailedPayment(failedInvoice);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

// Helper function to handle subscription changes
async function handleSubscriptionChange(subscription) {
  try {
    // Get the customer ID from the subscription
    const customerId = subscription.customer;
    
    // Find the user in your database
    const user = await User.findOne({ stripeCustomerId: customerId });
    
    if (!user) {
      console.error(`User not found for Stripe customer: ${customerId}`);
      return;
    }
    
    // Map the subscription status to your app's subscription level
    const subscriptionItems = await stripe.subscriptionItems.list({
      subscription: subscription.id
    });
    
    if (subscriptionItems.data.length === 0) {
      console.error(`No subscription items found for subscription: ${subscription.id}`);
      return;
    }
    
    const priceId = subscriptionItems.data[0].price.id;
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product']
    });
    
    const productId = price.product.id;
    
    // Map product to plan level
    const productToPlan = {
      'prod_basic': 'basic',
      'prod_premium': 'premium',
      'prod_elite': 'elite'
    };
    
    const planLevel = productToPlan[productId] || 'basic';
    
    // Update user subscription in database
    user.subscription = {
      stripeSubscriptionId: subscription.id,
      planLevel: planLevel,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      isFree: false
    };
    
    await user.save();
    
    console.log(`Updated subscription for user ${user.id} to ${planLevel}`);
  } catch (error) {
    console.error('Error handling subscription change:', error);
  }
}

// Helper function to handle successful invoice payment
async function handleInvoicePayment(invoice) {
  try {
    // Only process subscription invoices
    if (invoice.subscription) {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      await handleSubscriptionChange(subscription);
    }
  } catch (error) {
    console.error('Error handling invoice payment:', error);
  }
}

// Helper function to handle failed payments
async function handleFailedPayment(invoice) {
  try {
    // Find the user by customer ID
    const customerId = invoice.customer;
    const user = await User.findOne({ stripeCustomerId: customerId });
    
    if (!user) {
      console.error(`User not found for Stripe customer: ${customerId}`);
      return;
    }
    
    // Send notification to user about failed payment
    // This is where you would implement your notification system
    console.log(`Payment failed for user ${user.id}, invoice: ${invoice.id}`);
    
    // You might want to mark the subscription as problematic in your database
    if (user.subscription && invoice.subscription === user.subscription.stripeSubscriptionId) {
      user.subscription.paymentFailed = true;
      user.subscription.lastFailedPayment = new Date();
      await user.save();
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

module.exports = router;