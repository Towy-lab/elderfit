import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { useSubscription } from '../contexts/SubscriptionContext.js';

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
  const { hasAccess, loading: subscriptionLoading, subscription } = useSubscription();
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false);

  // Handle initial load
  useEffect(() => {
    if (!authLoading && !subscriptionLoading) {
      console.log('ProtectedRoute: Initial load complete', {
        hasUser: !!user,
        hasSubscription: !!subscription,
        currentTier: subscription?.tier,
        requiredTier,
        pathname: location.pathname,
        hasCheckedSubscription
      });
      setIsInitialLoad(false);
      setHasCheckedSubscription(true);
    }
  }, [authLoading, subscriptionLoading, user, subscription, requiredTier, location.pathname]);

  // Show loading state while checking auth or subscription
  if (authLoading || subscriptionLoading) {
    console.log('ProtectedRoute: Loading state', {
      authLoading,
      subscriptionLoading,
      hasUser: !!user,
      hasSubscription: !!subscription,
      pathname: location.pathname,
      requiredTier,
      isInitialLoad,
      hasCheckedSubscription
    });
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // Check if user is logged in
  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we're on an education page or this is a refresh, allow access
  const isEducationPage = location.pathname.includes('/education/');
  const isRefresh = !isInitialLoad && document.referrer.includes(location.pathname);
  
  if (isEducationPage || isRefresh) {
    console.log('ProtectedRoute: Allowing access during refresh or education page', {
      isEducationPage,
      isRefresh,
      pathname: location.pathname,
      referrer: document.referrer
    });
    return children;
  }

  // If we haven't checked subscription yet or it's still loading, allow access temporarily
  if (!hasCheckedSubscription || subscriptionLoading) {
    console.log('ProtectedRoute: Waiting for subscription check', {
      hasCheckedSubscription,
      subscriptionLoading,
      pathname: location.pathname
    });
    return children;
  }
  
  // Check if user has the required subscription level
  const hasRequiredAccess = hasAccess(requiredTier);
  console.log('ProtectedRoute: Subscription check', {
    requiredTier,
    currentTier: subscription?.tier,
    hasSubscription: subscription?.hasSubscription,
    hasAccess: hasRequiredAccess,
    pathname: location.pathname,
    isInitialLoad,
    isRefresh,
    hasCheckedSubscription,
    subscriptionStatus: subscription?.status
  });
  
  if (!hasRequiredAccess) {
    // Only redirect to upgrade page if we're not already there and not on an education page
    if (location.pathname !== '/subscription/upgrade' && !isEducationPage && !isRefresh) {
      console.log('ProtectedRoute: Redirecting to upgrade page');
      return <Navigate 
        to="/subscription/upgrade" 
        state={{ 
          requiredTier,
          from: location.pathname,
          message: `This content requires a ${requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} subscription.`
        }} 
        replace 
      />;
    }
  }
  
  // User is authenticated and has required subscription level, render the children
  console.log('ProtectedRoute: Rendering protected content', {
    requiredTier,
    currentTier: subscription?.tier,
    hasAccess: hasRequiredAccess,
    pathname: location.pathname,
    isInitialLoad,
    isRefresh,
    hasCheckedSubscription,
    subscriptionStatus: subscription?.status
  });
  return children;
};

export default ProtectedRoute;