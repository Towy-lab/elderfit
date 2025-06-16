import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import LoadingSpinner from '../LoadingSpinner';

/**
 * SubscriptionRoute - A component that protects routes based on user subscription level
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The child components to render if authorized
 * @param {string} props.requiredTier - The minimum subscription tier required ('basic', 'premium', or 'elite')
 * @param {string} props.redirectTo - Where to redirect if the user doesn't have the required tier
 * @returns {React.ReactNode}
 */
const SubscriptionRoute = ({ 
  children, 
  requiredTier = 'basic',
  redirectTo = '/subscription'
}) => {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  // Order of tiers for comparison (higher index = higher tier)
  const tierOrder = ['basic', 'premium', 'elite'];

  // Determine if loading
  const isLoading = authLoading || subscriptionLoading;

  // Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required subscription level
  const userTierIndex = tierOrder.indexOf(subscription?.tier || 'basic');
  const requiredTierIndex = tierOrder.indexOf(requiredTier);

  // Allow access if user's tier is equal to or higher than required tier
  if (userTierIndex >= requiredTierIndex) {
    return children;
  }

  // Redirect with appropriate parameters if user doesn't have required tier
  return (
    <Navigate 
      to={redirectTo} 
      state={{ 
        requiredTier, 
        from: location,
        message: `This content requires a ${requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} subscription.`
      }} 
      replace 
    />
  );
};

export default SubscriptionRoute;