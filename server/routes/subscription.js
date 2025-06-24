import express from 'express';
import authMiddleware from '../middleware/auth.js';
import User from '../models/User.js';
import { sendSubscriptionWelcomeEmail } from '../services/email.js';

const router = express.Router();

// Register user for free basic plan
router.post('/register-free-plan', authMiddleware, async (req, res) => {
  try {
    const { planId, planName } = req.body;
    const userId = req.user.id;
    
    // Get user from database
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if user already has a subscription
    if (user.subscription && user.subscription.planLevel && 
        ['premium', 'elite'].includes(user.subscription.planLevel)) {
      // Don't downgrade paid subscribers to free tier
      return res.status(400).json({ 
        error: 'You already have a premium subscription that includes all basic features'
      });
    }
    
    // Update user's subscription to basic free tier
    user.subscription = {
      planLevel: 'basic',
      status: 'active',
      isFree: true,
      startDate: new Date(),
      // Set far future date as "never expires"
      currentPeriodEnd: new Date(2099, 11, 31) 
    };
    
    await user.save();
    
    // Add user to email marketing list (commented out for simplicity)
    // await addUserToEmailList(user.email, {...});
    
    // Send welcome email (commented out for simplicity)
    // await sendSubscriptionWelcomeEmail(user.email, {...});
    
    // Return subscription details
    res.status(200).json({
      status: 'basic',
      details: {
        planLevel: 'basic',
        planName: 'Basic',
        status: 'active',
        isFree: true,
        startDate: user.subscription.startDate
      }
    });
  } catch (error) {
    console.error('Error registering for free plan:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get subscription status
router.get('/subscription-status', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user from database
    const user = await User.findById(userId);
    
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
    
    // For paid subscriptions (simplified)
    if (user.subscription && user.subscription.planLevel) {
      return res.status(200).json({
        status: user.subscription.planLevel,
        details: user.subscription
      });
    }
    
    // No subscription
    return res.status(200).json({ 
      status: 'none',
      details: null
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;