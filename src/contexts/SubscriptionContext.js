import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext'; // Use the hook instead of importing the context

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const { currentUser } = useAuth(); // Use the hook
  const [userSubscription, setUserSubscription] = useState('basic'); // Default to basic
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscription data when user is logged in
  useEffect(() => {
    if (!currentUser) {
      setUserSubscription('basic');
      setSubscriptionDetails(null);
      setIsLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, you would call your API endpoint
        // const response = await api.get('/subscription');
        
        // For now, we'll simulate this with a timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - in real app, this would come from response.data
        const mockSubscriptionData = {
          tier: localStorage.getItem('userSubscription') || 'basic',
          status: 'active',
          renewalDate: '2023-12-31',
          paymentMethod: localStorage.getItem('userSubscription') !== 'basic' ? 'Credit Card' : null,
          features: {
            workouts: localStorage.getItem('userSubscription') === 'basic' ? 5 : 
                     localStorage.getItem('userSubscription') === 'premium' ? 30 : 50,
            professionalSupport: localStorage.getItem('userSubscription') === 'elite',
            familyProfiles: localStorage.getItem('userSubscription') === 'elite' ? 3 : 0,
            advancedTracking: localStorage.getItem('userSubscription') !== 'basic',
          }
        };
        
        setUserSubscription(mockSubscriptionData.tier);
        setSubscriptionDetails(mockSubscriptionData);
      } catch (err) {
        console.error('Error fetching subscription data:', err);
        setError('Failed to load subscription details. Please try again later.');
        // Default to basic on error to be safe
        setUserSubscription('basic');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [currentUser]);

  // Update subscription tier
  const updateSubscription = async (newTier) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would call your API endpoint
      // const response = await api.post('/subscription/update', { tier: newTier });
      
      // For now, we'll simulate this with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for demo purposes (in real app, this comes from backend)
      localStorage.setItem('userSubscription', newTier);
      
      // Update state with new subscription tier
      setUserSubscription(newTier);
      
      // Update subscription details
      setSubscriptionDetails(prev => ({
        ...prev,
        tier: newTier,
        features: {
          workouts: newTier === 'basic' ? 5 : newTier === 'premium' ? 30 : 50,
          professionalSupport: newTier === 'elite',
          familyProfiles: newTier === 'elite' ? 3 : 0,
          advancedTracking: newTier !== 'basic',
        }
      }));
      
      return true;
    } catch (err) {
      console.error('Error updating subscription:', err);
      setError('Failed to update subscription. Please try again later.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has access to a specific tier feature
  const hasAccess = (requiredTier) => {
    const tierOrder = ['basic', 'premium', 'elite'];
    const userTierIndex = tierOrder.indexOf(userSubscription);
    const requiredTierIndex = tierOrder.indexOf(requiredTier);
    
    return userTierIndex >= requiredTierIndex;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        userSubscription,
        subscriptionDetails,
        updateSubscription,
        hasAccess,
        isLoading,
        error
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

// Add the custom hook
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

export default SubscriptionContext;