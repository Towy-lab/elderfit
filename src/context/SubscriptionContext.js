// src/contexts/SubscriptionContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth'; // Updated import path
import { 
  getSubscription, 
  upgradeSubscription as apiUpgradeSubscription, 
  upgradeFromBasic as apiUpgradeFromBasic,
  downgradeToBasic as apiDowngradeToBasic,
  cancelSubscription as apiCancelSubscription,
  createCheckoutSession as apiCreateCheckoutSession,
  signupBasic as apiSignupBasic
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

  // Fetch subscription data - use useCallback to memoize
  const fetchSubscription = useCallback(async () => {
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
  }, [isAuthenticated]); // Only depends on isAuthenticated

  // Fetch subscription when user changes or auth state changes
  useEffect(() => {
    fetchSubscription();
  }, [isAuthenticated, user?._id, fetchSubscription]); // Now fetchSubscription is properly included

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

  // Rest of your existing functions...
  // Upgrade subscription
  const upgradeSubscription = async (newTier) => {
    try {
      setLoading(true);
      
      // If current subscription is free basic and upgrading to paid tier
      if (subscription?.tier === 'basic' && !subscription?.id && newTier !== 'basic') {
        const data = await apiUpgradeFromBasic({ tier: newTier });
        return { success: true, sessionId: data.sessionId };
      } 
      
      // If already on a paid plan
      const data = await apiUpgradeSubscription({ tier: newTier });
      await fetchSubscription(); // Refresh subscription data
      return { success: true, message: data.message };
    } catch (err) {
      console.error('Error upgrading subscription:', err);
      setError(err.response?.data?.error || 'Failed to upgrade subscription');
      return { success: false, error: err.response?.data?.error || 'Failed to upgrade subscription' };
    } finally {
      setLoading(false);
    }
  };

  // Downgrade to basic (free) tier
  const downgradeToBasic = async () => {
    try {
      setLoading(true);
      const data = await apiDowngradeToBasic();
      await fetchSubscription(); // Refresh subscription data
      return { success: true, message: data.message };
    } catch (err) {
      console.error('Error downgrading to basic:', err);
      setError(err.response?.data?.error || 'Failed to downgrade subscription');
      return { success: false, error: err.response?.data?.error || 'Failed to downgrade subscription' };
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      setLoading(true);
      const data = await apiCancelSubscription();
      await fetchSubscription(); // Refresh subscription data
      return { success: true, message: data.message };
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError(err.response?.data?.error || 'Failed to cancel subscription');
      return { success: false, error: err.response?.data?.error || 'Failed to cancel subscription' };
    } finally {
      setLoading(false);
    }
  };

  // Get checkout session for new subscription
  const createCheckoutSession = async (tier) => {
    try {
      setLoading(true);
      
      // For basic tier, use a different endpoint
      if (tier.toLowerCase() === 'basic') {
        const data = await apiSignupBasic();
        return { success: true, isFree: true, message: data.message };
      }
      
      const data = await apiCreateCheckoutSession({ tier });
      
      // Check if this is a free tier redirect
      if (data.isFree && data.redirectTo) {
        const response = await apiSignupBasic();
        return { success: true, isFree: true, message: response.message };
      }
      
      return { success: true, isFree: false, sessionId: data.sessionId };
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError(err.response?.data?.error || 'Failed to create checkout session');
      return { success: false, error: err.response?.data?.error || 'Failed to create checkout session' };
    } finally {
      setLoading(false);
    }
  };

  // Format subscription tier display name
  const formatTierName = (tier) => {
    if (!tier) return 'Free';
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        error,
        hasTierAccess,
        upgradeSubscription,
        downgradeToBasic,
        cancelSubscription,
        createCheckoutSession,
        formatTierName,
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