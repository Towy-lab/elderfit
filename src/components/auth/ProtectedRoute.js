// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';

export const ProtectedRoute = ({ children, requiredPlan }) => {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!subscription || subscription.plan !== requiredPlan) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
};