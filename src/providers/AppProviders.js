import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { ProgressProvider } from '../contexts/ProgressContext';

// Combine all context providers
const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <ProgressProvider>
          {children}
        </ProgressProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
};

export default AppProviders;