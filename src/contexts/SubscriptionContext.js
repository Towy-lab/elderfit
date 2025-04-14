// src/contexts/SubscriptionContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
  getSubscription, 
  upgradeSubscription as apiUpgradeSubscription, 
  upgradeFromBasic as apiUpgradeFromBasic,
  downgradeToBasic as apiDowngradeToBasic,
  immediateDowngradeToBasic as apiImmediateDowngradeToBasic,
  downgradeToPremium as apiDowngradeToPremium,
  reactivateSubscription as apiReactivateSubscription,
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
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(0); // Add this for debouncing
  const MIN_REFRESH_INTERVAL = 3000; // 3 seconds between refreshes

  // Fetch subscription data with improved logging, caching, and force refresh option
  const fetchSubscription = async (forceRefresh = false) => {
    // Get current time to prevent excessive API calls
    const now = new Date();
    const minTimeBetweenFetches = 1000; // 1 second minimum between fetches
    
    // If we fetched recently and this isn't the first fetch, and not forcing refresh, don't fetch again
    if (
      !forceRefresh &&
      lastFetchTime && 
      now - lastFetchTime < minTimeBetweenFetches && 
      subscription !== null
    ) {
      console.log('Skipping subscription fetch - too soon since last fetch');
      return subscription;
    }
    
    if (!isAuthenticated) {
      console.log('Not authenticated, clearing subscription data');
      setSubscription(null);
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching subscription data from API');
      
      const data = await getSubscription();
      console.log('Subscription data received:', data);
      
      setSubscription(data);
      setLastFetchTime(new Date());
      return data; // Return data for further processing
    } catch (err) {
      console.error('Error fetching subscription data:', err);
      
      // Check if it's an authentication error
      if (err.response && err.response.status === 401) {
        console.log('Authentication error fetching subscription, clearing data');
        setSubscription(null);
      } else {
        // For other errors, keep existing subscription data
        console.log('API error, keeping existing subscription data');
      }
      
      setError('Failed to load subscription information');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add this improved forceRefreshSubscription function with debouncing
  const forceRefreshSubscription = async (bypassThrottle = false) => {
    const now = Date.now();
    if (!bypassThrottle && now - lastRequestTime < MIN_REFRESH_INTERVAL) {
      console.log('Throttling subscription refresh - too many requests');
      return subscription;
    }
    
    console.log('Forcing subscription refresh from API');
    setLastRequestTime(now); // Use state setter for lastRequestTime
    return await fetchSubscription(true);
  };

  // Fetch subscription when user changes
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User authenticated, fetching subscription data');
      fetchSubscription();
    } else {
      console.log('User not authenticated, clearing subscription data');
      setSubscription(null);
      setLoading(false);
    }
  }, [isAuthenticated, user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

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
    
    // Special case: Downgrading to Basic - Skip proration calculation
    if (newTier === 'basic') {
      console.log('Special case: Downgrade to Basic - skipping proration calculation');
      return {
        success: true,
        prorationDetails: {
          immediateCharge: 0, // No immediate charge for downgrades
          nextBillingAmount: 0, // Basic is free
          currency: 'usd',
          isDowngrade: true
        }
      };
    }
    
    // Special case: Downgrading from Elite to Premium - Skip proration calculation
    if (subscription?.tier === 'elite' && newTier === 'premium') {
      console.log('Special case: Downgrade from Elite to Premium - skipping proration calculation');
      return {
        success: true,
        prorationDetails: {
          immediateCharge: 0, // No immediate charge for downgrades
          nextBillingAmount: 9.99, // Hardcoded premium price - consider making dynamic
          currency: 'usd',
          isDowngrade: true
        }
      };
    }
    
    // Special case: Reactivation - Skip proration calculation
    if (subscription?.cancelAtPeriodEnd) {
      console.log('Reactivation case - skipping proration calculation');
      return {
        success: true,
        prorationDetails: {
          immediateCharge: 0,
          nextBillingAmount: subscription.tier === 'premium' ? 9.99 : 19.99,
          currency: 'usd',
          isReactivation: true
        }
      };
    }
    
    // Get proration details from API
    console.log('Calculating proration for tier change:', { fromTier: subscription?.tier, toTier: newTier, interval });
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
        console.log('Upgrading from basic to paid tier:', newTier);
        const data = await apiUpgradeFromBasic({ tier: newTier, interval });
        return { 
          success: true, 
          sessionId: data.sessionId,
          url: data.url,
          message: 'Redirecting to payment...'
        };
      } 
      
      // If already on a paid plan
      console.log('Upgrading existing paid subscription to:', newTier);
      const data = await apiUpgradeSubscription({ 
        tier: newTier,
        interval,
        prorationBehavior
      });
      
      await forceRefreshSubscription(true); // Use force refresh here
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
      await forceRefreshSubscription(true); // Use force refresh here
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
      await forceRefreshSubscription(true); // Use force refresh here
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

  // Downgrade from Elite to Premium tier
  const downgradeToPremium = async (interval = 'month') => {
    try {
      setLoading(true);
      const data = await apiDowngradeToPremium(interval);
      await forceRefreshSubscription(true); // Force refresh immediately
      return { 
        success: true, 
        message: data.message || 'Successfully downgraded to Premium tier.',
        subscription: data.subscription
      };
    } catch (err) {
      console.error('Error downgrading to premium:', err);
      setError(err.response?.data?.error || 'Failed to downgrade subscription');
      
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to downgrade to Premium tier' 
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Reactivate subscription
// Reactivate subscription
const reactivateSubscription = async () => {
  try {
    setLoading(true);
    
    // Check if subscription exists and is set to cancel
    if (!subscription) {
      throw new Error('No subscription found to reactivate');
    }
    
    // Better verification - check if it's actually canceling
    if (!subscription.cancelAtPeriodEnd) {
      throw new Error('Subscription is not scheduled for cancellation');
    }
    
    console.log('Reactivating subscription', subscription.id);
    const data = await apiReactivateSubscription();
    
    await forceRefreshSubscription(true);
    return {
      success: true,
      message: data.message || 'Your subscription has been reactivated successfully.'
    };
  } catch (err) {
    console.error('Error reactivating subscription:', err);
    setError(err.response?.data?.error || 'Failed to reactivate subscription');
    
    return {
      success: false,
      error: err.response?.data?.error || 'Failed to reactivate subscription'
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
      await forceRefreshSubscription(true); // Use force refresh here
      return { 
        success: true, 
        message: data.message,
        effectiveDate: data.effectiveDate
      };
    } catch (err) {
      console.error('Error canceling subscription:', err);
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
      await forceRefreshSubscription(true); // Use force refresh here
      return { 
        success: true, 
        message: data.message,
        effectiveDate: data.effectiveDate
      };
    } catch (err) {
      console.error('Error canceling subscription immediately:', err);
      setError(err.response?.data?.error || 'Failed to cancel subscription immediately');
      
      return { 
        success: false, 
        error: err.response?.data?.error || 'Failed to cancel subscription immediately' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Create checkout session for new subscription
  const createCheckoutSession = async (tier, interval = 'month') => {
    try {
      setLoading(true);
      
      // For basic tier, use a different endpoint
      if (tier.toLowerCase() === 'basic') {
        const data = await apiSignupBasic();
        await forceRefreshSubscription(true); // Force refresh after signup
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
        await forceRefreshSubscription(true); // Force refresh after signup
        return { 
          success: true, 
          isFree: true, 
          message: response.message 
        };
      }
      
      return { 
        success: true, 
        isFree: false, 
        sessionId: data.sessionId,
        url: data.url // Add URL if available
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
    
    // Always add basic as a downgrade option for paid tiers
    if (currentLevel > 0) {
      downgradeTiers.push('basic');
    }
    
    // Add premium as downgrade option for elite
    if (currentLevel > 1) {
      downgradeTiers.push('premium');
    }
    
    return downgradeTiers;
  };

  // Create context value
  const value = {
    subscription,
    loading,
    error,
    hasTierAccess,
    calculateProration,
    upgradeSubscription,
    downgradeToBasic,
    immediateDowngradeToBasic,
    downgradeToPremium,
    reactivateSubscription,
    cancelSubscription,
    cancelSubscriptionImmediately,
    createCheckoutSession,
    formatTierName,
    formatDate,
    getValidUpgradeTiers,
    getValidDowngradeTiers,
    refreshSubscription: fetchSubscription,
    forceRefreshSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
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