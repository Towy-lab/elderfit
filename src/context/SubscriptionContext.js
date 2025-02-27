import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const SubscriptionContext = createContext(null);

// Create a provider component
export const SubscriptionProvider = ({ children }) => {
  // Subscription states: 'none', 'basic', 'premium', 'elite'
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check subscription status on mount and when auth state changes
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        setIsLoading(true);
        
        // Get the current user from your auth system
        const user = localStorage.getItem('user') 
          ? JSON.parse(localStorage.getItem('user')) 
          : null;
        
        if (!user) {
          // No user logged in
          setSubscriptionStatus('none');
          setSubscriptionDetails(null);
          setIsLoading(false);
          return;
        }

        // Call your backend API to get subscription status
        const response = await fetch('/api/subscription-status', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch subscription status');
        }

        const data = await response.json();
        
        setSubscriptionStatus(data.status);
        setSubscriptionDetails(data.details);
      } catch (err) {
        console.error('Error checking subscription status:', err);
        setError(err.message);
        // Fallback to stored subscription if available
        const storedSubscription = localStorage.getItem('subscription');
        if (storedSubscription) {
          const parsedSubscription = JSON.parse(storedSubscription);
          setSubscriptionStatus(parsedSubscription.status);
          setSubscriptionDetails(parsedSubscription.details);
        } else {
          setSubscriptionStatus('none');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscriptionStatus();
    
    // Set up a subscription status check every 30 minutes
    const interval = setInterval(checkSubscriptionStatus, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Function to update subscription after successful payment
  const updateSubscriptionAfterPayment = async (sessionId) => {
    try {
      setIsLoading(true);
      
      const user = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')) 
        : null;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Verify the payment with your backend
      const response = await fetch('/api/verify-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ sessionId })
      });

      if (!response.ok) {
        throw new Error('Failed to verify subscription payment');
      }

      const data = await response.json();
      
      // Update subscription state
      setSubscriptionStatus(data.status);
      setSubscriptionDetails(data.details);
      
      // Store subscription info in localStorage as a fallback
      localStorage.setItem('subscription', JSON.stringify({
        status: data.status,
        details: data.details
      }));
      
      return { success: true, data };
    } catch (err) {
      console.error('Error updating subscription:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Function to check if user has access to a specific feature
  const hasAccess = (requiredLevel) => {
    // Define access levels in order of increasing privileges
    const levels = ['none', 'basic', 'premium', 'elite'];
    
    const currentLevelIndex = levels.indexOf(subscriptionStatus);
    const requiredLevelIndex = levels.indexOf(requiredLevel);
    
    return currentLevelIndex >= requiredLevelIndex;
  };

  // Function to handle subscription cancellation
  const cancelSubscription = async () => {
    try {
      setIsLoading(true);
      
      const user = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user')) 
        : null;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      const data = await response.json();
      
      // Update subscription state based on cancellation result
      // Note: Often subscriptions remain active until the end of the billing period
      setSubscriptionDetails({
        ...subscriptionDetails,
        canceledAt: data.canceledAt,
        activeUntil: data.activeUntil,
        status: 'canceled_pending'
      });
      
      // Update localStorage
      localStorage.setItem('subscription', JSON.stringify({
        status: subscriptionStatus,
        details: {
          ...subscriptionDetails,
          canceledAt: data.canceledAt,
          activeUntil: data.activeUntil,
          status: 'canceled_pending'
        }
      }));
      
      return { success: true, data };
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Provider value
  const value = {
    subscriptionStatus,
    subscriptionDetails,
    isLoading,
    error,
    setSubscriptionStatus,
    setSubscriptionDetails,
    updateSubscriptionAfterPayment,
    hasAccess,
    cancelSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};