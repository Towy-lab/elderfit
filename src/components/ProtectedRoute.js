import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

/**
 * Protected Route component that restricts access based on user authentication
 * and subscription level
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The components to render if authorized
 * @param {string} props.requiredTier - Minimum subscription tier required ('basic', 'premium', 'elite')
 * @returns {JSX.Element} - React component
 */
const ProtectedRoute = ({ children, requiredTier = 'basic' }) => {
  const { user, loading: authLoading } = useAuth();
  const { hasAccess, loading: subscriptionLoading } = useSubscription();
  const location = useLocation();

  // Show loading state while checking auth or subscription
  const isLoading = authLoading || subscriptionLoading;
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has the required subscription level
  if (!hasAccess(requiredTier)) {
    return <Navigate to="/subscription/upgrade" state={{ 
      requiredTier: requiredTier,
      from: location.pathname 
    }} replace />;
  }
  
  // User is authenticated and has required subscription level, render the children
  return children;
};

export default ProtectedRoute;