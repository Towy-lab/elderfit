// src/contexts/SubscriptionContext.js - Enhanced with proration calculation and improved functions
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  getSubscription, 
  upgradeSubscription as apiUpgradeSubscription, 
  upgradeFromBasic as apiUpgradeFromBasic,
  downgradeToBasic as apiDowngradeToBasic,
  immediateDowngradeToBasic as apiImmediateDowngradeToBasic,
  cancelSubscription as apiCancelSubscription,
  cancelSubscriptionImmediately as apiCancelSubscriptionImmediately,
  createCheckoutSession as apiCreateCheckoutSession,
  signupBasic as apiSignupBasic,
  calculateProration as apiCalculateProration
} from '../services/api';

// Create context
const SubscriptionContext = createContext();

// Create provider component
export const SubscriptionProvider = ({ children }) => {
  const auth = useAuth();
  const isAuthenticated = auth?.isAuthenticated || false;
  const user = auth?.user || null;
  
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscription data
  const fetchSubscription = async () => {
    if (!isAuthenticated) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getSubscription();
      setSubscription(data);
    } catch (err) {
      console.error('Error fetching subscription data:', err);
      setError('Failed to load subscription information');
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription when user changes
  useEffect(() => {
    fetchSubscription();
  }, [isAuthenticated, user?._id]);

  // Check if user has access to a specific tier
  const hasTierAccess = (requiredTier) => {
    if (!subscription || !subscription.hasSubscription) {
      return requiredTier === 'basic';
    }

    const tierLevels = {
      'basic': 0,
      'premium': 1,
      'elite': 2
    };

    const userTierLevel = tierLevels[subscription.tier] || 0;
    const requiredTierLevel = tierLevels[requiredTier] || 0;

    return userTierLevel >= requiredTierLevel;
  };
  
  // Calculate proration for changing subscription
  const calculateProration = async (newTier, interval = 'month') => {
    try {
      setLoading(true);
      
      // Check if user has a subscription first
      if (!subscription?.id && subscription?.tier !== 'basic') {
        throw new Error('No active subscription found to calculate proration');
      }
      
      // For free tier, no proration needed
      if (subscription?.tier === 'basic' && !subscription?.id) {
        return {
          success: true,
          prorationDetails: {
            immediateCharge: 0,
            nextBillingAmount: 0,
            currency: 'usd'
          }
        };
      }
      
      // Get proration details from API
      const data = await apiCalculateProration({ tier: newTier, interval });
      
      return {
        success: true,
        prorationDetails: data
      };
    } catch (err) {
      console.error('Error calculating proration:', err);
      setError(err.response?.data?.error || 'Failed to calculate proration');
      
      return {
        success: false,
        error: err.response?.data?.error || 'Failed to calculate proration'
      };
    } finally {
      setLoading(false);
    }
  };

  // Upgrade subscription
  const upgradeSubscription = async (newTier, options = {}) => {
    try {
      const { interval = 'month', prorationBehavior = 'create_prorations' } = options;
      setLoading(true);
      
      // If current subscription is free basic and upgrading to paid tier
      if (subscription?.tier === 'basic' && !subscription?.id && newTier !== 'basic') {
        const data = await apiUpgradeFromBasic({ tier: newTier, interval });
        return { 
          success: true, 
          sessionId: data.sessionId,
          message: 'Redirecting to payment...'
        };
      } 
      
      // If already on a paid plan
      const data = await apiUpgradeSubscription({ 
        tier: newTier,
        interval,
        prorationBehavior
      });
      
      await fetchSubscription(); // Refresh subscription data
      return { success: true, message: data.message };
    } catch (err) {
      console.error('Error upgrading subscription:', err);
      setError(err.response?.data?.error || 'Failed to upgrade subscription');
      
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to upgrade subscription' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Downgrade to basic (free) tier at period end
  const downgradeToBasic = async () => {
    try {
      setLoading(true);
      const data = await apiDowngradeToBasic();
      await fetchSubscription(); // Refresh subscription data
      return { 
        success: true, 
        message: data.message,
        effectiveDate: data.effectiveDate
      };
    } catch (err) {
      console.error('Error downgrading to basic:', err);
      setError(err.response?.data?.error || 'Failed to downgrade subscription');
      
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to downgrade subscription' 
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Downgrade to basic (free) tier immediately
  const immediateDowngradeToBasic = async () => {
    try {
      setLoading(true);
      const data = await apiImmediateDowngradeToBasic();
      await fetchSubscription(); // Refresh subscription data
      return { 
        success: true, 
        message: data.message,
        effectiveDate: data.effectiveDate
      };
    } catch (err) {
      console.error('Error immediately downgrading to basic:', err);
      setError(err.response?.data?.error || 'Failed to downgrade subscription');
      
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to downgrade subscription immediately' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription at period end
  const cancelSubscription = async () => {
    try {
      setLoading(true);
      const data = await apiCancelSubscription();
      await fetchSubscription(); // Refresh subscription data
      return { 
        success: true, 
        message: data.message,
        effectiveDate: data.effectiveDate
      };
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError(err.response?.data?.error || 'Failed to cancel subscription');
      
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to cancel subscription' 
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel subscription immediately
  const cancelSubscriptionImmediately = async () => {
    try {
      setLoading(true);
      const data = await apiCancelSubscriptionImmediately();
      await fetchSubscription(); // Refresh subscription data
      return { 
        success: true, 
        message: data.message,
        effectiveDate: data.effectiveDate
      };
    } catch (err) {
      console.error('Error cancelling subscription immediately:', err);
      setError(err.response?.data?.error || 'Failed to cancel subscription immediately');
      
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to cancel subscription immediately' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Get checkout session for new subscription
  const createCheckoutSession = async (tier, interval = 'month') => {
    try {
      setLoading(true);
      
      // For basic tier, use a different endpoint
      if (tier.toLowerCase() === 'basic') {
        const data = await apiSignupBasic();
        return { 
          success: true, 
          isFree: true, 
          message: data.message 
        };
      }
      
      const data = await apiCreateCheckoutSession({ tier, interval });
      
      // Check if this is a free tier redirect
      if (data.isFree && data.redirectTo) {
        const response = await apiSignupBasic();
        return { 
          success: true, 
          isFree: true, 
          message: response.message 
        };
      }
      
      return { 
        success: true, 
        isFree: false, 
        sessionId: data.sessionId 
      };
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err.response?.data?.error || 'Failed to create checkout session');
      
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to create checkout session' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Format subscription tier display name
  const formatTierName = (tier) => {
    if (!tier) return 'Free';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };
  
  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get tiers that are valid upgrade options
  const getValidUpgradeTiers = () => {
    const currentTier = subscription?.tier || 'basic';
    const tierLevels = {
      'basic': 0,
      'premium': 1,
      'elite': 2
    };
    
    const currentLevel = tierLevels[currentTier] || 0;
    const upgradeTiers = [];
    
    if (currentLevel < 1) {
      upgradeTiers.push('premium');
    }
    
    if (currentLevel < 2) {
      upgradeTiers.push('elite');
    }
    
    return upgradeTiers;
  };
  
  // Get tiers that are valid downgrade options
  const getValidDowngradeTiers = () => {
    const currentTier = subscription?.tier || 'basic';
    const tierLevels = {
      'basic': 0,
      'premium': 1,
      'elite': 2
    };
    
    const currentLevel = tierLevels[currentTier] || 0;
    const downgradeTiers = [];
    
    if (currentLevel > 0) {
      downgradeTiers.push('basic');
    }
    
    if (currentLevel > 1) {
      downgradeTiers.push('premium');
    }
    
    return downgradeTiers;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        error,
        hasTierAccess,
        calculateProration,
        upgradeSubscription,
        downgradeToBasic,
        immediateDowngradeToBasic,
        cancelSubscription,
        cancelSubscriptionImmediately,
        createCheckoutSession,
        formatTierName,
        formatDate,
        getValidUpgradeTiers,
        getValidDowngradeTiers,
        refreshSubscription: fetchSubscription
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// Create custom hook for using the subscription context
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;