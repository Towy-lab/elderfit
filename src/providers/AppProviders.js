import React from 'react';
import { AuthProvider } from './AuthProvider';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';

// Comment out or conditionally include providers that might not exist
// import { SafetyProvider } from './SafetyProvider';
// import { SchedulingProvider } from './SchedulingProvider';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        {/* Temporarily remove the missing providers */}
        {children}
      </SubscriptionProvider>
    </AuthProvider>
  );
};