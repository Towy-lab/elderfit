import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create the context
const SubscriptionContext = createContext();

// Create a custom hook to use the subscription context
export const useSubscription = () => {
  return useContext(SubscriptionContext);
};

// Create the provider component
export const SubscriptionProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [tier, setTier] = useState('basic'); // Default to basic tier
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing subscription on auth change or component mount
  useEffect(() => {
    const checkSubscription = () => {
      try {
        console.log("Checking subscription for user:", user?.id);
        
        if (isAuthenticated && user) {
          // Get subscription from localStorage or use default
          const storedSubscription = localStorage.getItem('subscription');
          
          if (storedSubscription) {
            // Parse stored subscription data
            const subscriptionData = JSON.parse(storedSubscription);
            console.log("Found subscription:", subscriptionData);
            
            // Set tier from stored data
            setTier(subscriptionData.tier);
          } else {
            // No stored subscription, default to basic
            console.log("No subscription found, defaulting to basic tier");
            setTier('basic');
            
            // For demo purposes, store a basic subscription
            localStorage.setItem('subscription', JSON.stringify({
              tier: 'basic',
              userId: user.id,
              startDate: new Date().toISOString()
            }));
          }
        } else {
          // No authenticated user, default to basic
          console.log("No authenticated user, defaulting to basic tier");
          setTier('basic');
        }
      } catch (error) {
        // Handle any errors
        console.error('Error checking subscription:', error);
        // Default to basic tier
        setTier('basic');
      } finally {
        // Set loading to false regardless of outcome
        setIsLoading(false);
      }
    };
    
    checkSubscription();
  }, [isAuthenticated, user]);
  
  // Update subscription tier
  const updateTier = (newTier) => {
    console.log("Updating subscription tier to:", newTier);
    
    if (!['basic', 'premium', 'elite'].includes(newTier)) {
      console.error('Invalid tier:', newTier);
      return false;
    }
    
    // Update state
    setTier(newTier);
    
    // Update in localStorage
    if (isAuthenticated && user) {
      localStorage.setItem('subscription', JSON.stringify({
        tier: newTier,
        userId: user.id,
        updatedAt: new Date().toISOString()
      }));
    }
    
    return true;
  };
  
  // Value object to be provided to consumers
  const value = {
    tier,
    isLoading,
    updateTier
  };
  
  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;