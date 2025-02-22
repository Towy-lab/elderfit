import React, { createContext, useContext, useState, useEffect } from 'react';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        // TODO: Replace with actual API call to your backend
        const mockSubscription = {
          // Uncomment one of these to test different subscription states
          // plan: 'Premium',
          // plan: 'Family',
          plan: null,
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        };

        setSubscription(mockSubscription);
        setError(null);
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError('Failed to load subscription status');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const updateSubscription = async (newPlan) => {
    try {
      setSubscription(prev => ({
        ...prev,
        plan: newPlan,
      }));
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating subscription:', err);
      setError('Failed to update subscription');
      return false;
    }
  };

  const cancelSubscription = async () => {
    try {
      setSubscription(prev => ({
        ...prev,
        plan: null,
        status: 'cancelled',
      }));
      setError(null);
      return true;
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Failed to cancel subscription');
      return false;
    }
  };

  const value = {
    subscription,
    loading,
    error,
    updateSubscription,
    cancelSubscription,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};