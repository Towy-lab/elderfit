import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';

export const ProtectedRoute = ({ children }) => {
  const { subscription } = useSubscription();

  if (!subscription) {
    return <Navigate to="/login" />;
  }

  return children;
};