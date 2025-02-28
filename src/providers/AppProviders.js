// src/providers/AppProviders.js
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { ProgressProvider } from '../contexts/ProgressContext';

// Create a client
const queryClient = new QueryClient();

// This component wraps all the providers needed in the application
export const AppProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SubscriptionProvider>
          <ProgressProvider>
            {children}
          </ProgressProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;