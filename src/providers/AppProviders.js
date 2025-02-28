import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { ProgressProvider } from '../contexts/ProgressContext';

// This component wraps all the providers needed in the application
export const AppProviders = ({ children }) => {
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