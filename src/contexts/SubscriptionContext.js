// src/contexts/SubscriptionContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext.js';
import { 
  api,
  getSubscription, 
  upgradeSubscription as apiUpgradeSubscription, 
  upgradeFromBasic as apiUpgradeFromBasic,
  downgradeToBasic as apiDowngradeToBasic,
  downgradeToPremium as apiDowngradeToPremium,
  reactivateSubscription as apiReactivateSubscription,
  cancelSubscription as apiCancelSubscription,
  cancelSubscriptionImmediately as apiCancelSubscriptionImmediately,
  createCheckoutSession as apiCreateCheckoutSession,
  signupBasic as apiSignupBasic,
  calculateProration as apiCalculateProration,
  immediateDowngradeToBasic as apiImmediateDowngradeToBasic
} from '../services/api.js';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.js';
import { Button } from '../components/ui/button.js';
import { Badge } from '../components/ui/badge.js';
import { Progress } from '../components/ui/progress.js';
import { CreditCard, Lock, CheckCircle, AlertTriangle, Star, Crown, Zap, Shield, Heart, Activity, Brain, TrendingUp, Calendar, Clock, Target, Users, Info } from 'lucide-react';

// Create context
const SubscriptionContext = createContext();

// Create provider component
export const SubscriptionProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const MIN_REFRESH_INTERVAL = 3000; // 3 seconds between refreshes

  // Fetch subscription data with improved logging, caching, and force refresh option
  const fetchSubscription = useCallback(async (forceRefresh = false) => {
    // Get current time to prevent excessive API calls
    const now = new Date();
    const minTimeBetweenFetches = 2000; // Increase to 2 seconds minimum between fetches
    
    console.log('Fetching subscription:', {
      forceRefresh,
      lastFetchTime,
      timeSinceLastFetch: lastFetchTime ? now - lastFetchTime : 'never',
      hasSubscription: !!subscription,
      userId: user?._id
    });
    
    // If we fetched recently and this isn't the first fetch, and not forcing refresh, don't fetch again
    if (
      !forceRefresh &&
      lastFetchTime && 
      now - lastFetchTime < minTimeBetweenFetches && 
      subscription !== null
    ) {
      console.log('Using cached subscription data');
      return subscription;
    }
    
    if (!user?._id) {
      console.log('No user ID, clearing subscription');
      setSubscription(null);
      setLoading(false);
      return null;
    }

    // Prevent multiple simultaneous requests
    if (loading) {
      console.log('Already loading subscription, skipping request');
      return subscription;
    }

    // Set loading state before the try block
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching subscription data from API');
      const data = await getSubscription();
      
      if (!data) {
        console.log('No subscription data received from API');
        setError('Failed to load subscription information');
        setSubscription(null);
        return null;
      }
      
      // Ensure we have the correct tier information
      if (data.tier) {
        console.log('Processing subscription data:', data);
        const subscriptionData = {
          ...data,
          hasSubscription: data.hasSubscription !== undefined ? data.hasSubscription : (data.tier !== 'basic' || data.id !== undefined)
        };
        setSubscription(subscriptionData);
        setLastFetchTime(new Date());
        return subscriptionData;
      } else {
        console.log('Invalid subscription data received:', data);
        setError('Invalid subscription data received');
        setSubscription(null);
        return null;
      }
    } catch (err) {
      console.error('Error fetching subscription:', err);
      // Check if it's an authentication error
      if (err.response && err.response.status === 401) {
        setSubscription(null);
      }
      
      setError('Failed to load subscription information');
      return null;
    } finally {
      // Always clear loading state in finally block
      console.log('Clearing loading state');
      setLoading(false);
    }
  }, [user?._id, lastFetchTime]);

  // Add this improved forceRefreshSubscription function with debouncing
  const forceRefreshSubscription = async (bypassThrottle = false) => {
    const now = Date.now();
    if (!bypassThrottle && now - lastRequestTime < MIN_REFRESH_INTERVAL) {
      console.log('Skipping refresh due to throttle');
      return subscription;
    }
    
    setLastRequestTime(now);
    try {
      const result = await fetchSubscription(true);
      return result;
    } catch (error) {
      console.error('Error in forceRefreshSubscription:', error);
      return null;
    }
  };

  // Debug subscription state changes
  useEffect(() => {
    console.log('Subscription state changed:', {
      tier: subscription?.tier,
      hasSubscription: subscription?.hasSubscription,
      status: subscription?.status,
      loading,
      error
    });
  }, [subscription, loading, error]);

  // Fetch subscription when user changes
  useEffect(() => {
    let isMounted = true;
    
    if (user?._id) {
      console.log('User changed, fetching subscription for user:', {
        userId: user._id,
        userEmail: user.email,
        userSubscription: user.subscription
      });
      // Clear cache to ensure fresh data is fetched
      setLastFetchTime(null);
      setSubscription(null); // Clear existing subscription data
      setLoading(true); // Set loading state
      // Force refresh when user changes to ensure fresh data
      fetchSubscription(true).then((result) => {
        if (!isMounted) {
          console.log('Component unmounted, skipping subscription update');
        } else {
          console.log('Subscription updated after user change:', {
            result,
            userSubscription: user.subscription,
            fetchedSubscription: result
          });
        }
      });
    } else {
      if (isMounted) {
        console.log('No user, clearing subscription data');
        setSubscription(null);
        setLoading(false);
        setLastFetchTime(null);
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [user?._id]); // Remove fetchSubscription from dependencies

  // Check if user has access to a specific tier
  const hasAccess = (requiredTier) => {
    // If still loading, return true to prevent premature redirects
    if (loading || authLoading) {
      console.log('Subscription check: Still loading, allowing access temporarily');
      return true;
    }

    // If not authenticated, deny access to all tiers
    if (!user) {
      console.log('Subscription check: No user, denying access');
      return false;
    }

    // If no subscription data yet, only allow basic access
    if (!subscription) {
      console.log('Subscription check: No subscription data, allowing basic access only');
      return requiredTier === 'basic';
    }

    // Define tier levels
    const tierLevels = {
      'basic': 0,
      'premium': 1,
      'elite': 2
    };

    // Get user's current tier level
    const userTierLevel = tierLevels[subscription.tier] || 0;
    const requiredTierLevel = tierLevels[requiredTier] || 0;

    // For basic tier, check if user has any subscription
    if (requiredTier === 'basic') {
      console.log('Subscription check: Basic tier requested, allowing access');
      return true; // Everyone has access to basic
    }

    // For premium and elite, check subscription status
    if (requiredTier === 'premium' || requiredTier === 'elite') {
      // Check if user's tier level meets or exceeds required level
      const hasRequiredTier = userTierLevel >= requiredTierLevel;
      
      // For elite tier users, they should have access to their tier regardless of hasSubscription status
      // (they might be on a free elite tier or have special access)
      if (subscription.tier === 'elite' && requiredTier === 'elite') {
        console.log('Subscription check: Elite user accessing elite tier, allowing access');
        return true;
      }
      
      // For premium tier, check if user has an active subscription or is elite
      if (requiredTier === 'premium') {
        if (subscription.tier === 'elite') {
          console.log('Subscription check: Elite user accessing premium tier, allowing access');
          return true;
        }
        if (!subscription.hasSubscription) {
          console.log('Subscription check: No active subscription for premium access');
          return false;
        }
      }
      
      console.log('Subscription check:', {
        requiredTier,
        currentTier: subscription.tier,
        userTierLevel,
        requiredTierLevel,
        hasRequiredTier,
        hasSubscription: subscription.hasSubscription,
        subscriptionStatus: subscription.status,
        subscriptionId: subscription.id
      });
      return hasRequiredTier;
    }

    console.log('Subscription check: No matching tier found, denying access');
    return false; // Default to no access
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
    hasAccess,
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