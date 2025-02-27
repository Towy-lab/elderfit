import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { SubscriptionContext } from '../context/SubscriptionContext';

/**
 * Protected Route component that restricts access based on user authentication
 * and subscription level
 * 
 * @param {Object} props - Component props
 * @param {string} props.requiredSubscription - Minimum subscription level required ('none', 'basic', 'premium', 'elite')
 * @returns {JSX.Element} - React component
 */
const ProtectedRoute = ({ requiredSubscription = 'none' }) => {
  const { subscriptionStatus, isLoading, hasAccess } = useContext(SubscriptionContext);
  const location = useLocation();
  
  // Get current user from localStorage or your auth context
  const user = localStorage.getItem('user') 
    ? JSON.parse(localStorage.getItem('user')) 
    : null;
  
  // Show loading state while checking subscription
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Check if user is logged in
  if (!user) {
    // Redirect to login page, but save the location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check if user has the required subscription level
  if (!hasAccess(requiredSubscription)) {
    // If user doesn't have required subscription, redirect to upgrade page
    return <Navigate to="/subscription/upgrade" state={{ 
      requiredLevel: requiredSubscription,
      from: location.pathname 
    }} replace />;
  }
  
  // User is authenticated and has required subscription level, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;