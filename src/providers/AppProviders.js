import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../contexts/AuthContext.js';
import { SubscriptionProvider } from '../contexts/SubscriptionContext.js';
import { ContentProvider } from '../contexts/ContentContext.js';
import { SafetyProvider } from '../contexts/SafetyContext.js';
import { ProgressProvider } from '../contexts/ProgressContext.js';
import { HealthProvider } from '../contexts/HealthContext.js';

// Comment out or conditionally include providers that might not exist
// import { SafetyProvider } from './SafetyProvider';
// import { SchedulingProvider } from './SchedulingProvider';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <ContentProvider>
          <SafetyProvider>
            {/* Temporarily remove the missing providers */}
            {children}
          </SafetyProvider>
        </ContentProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
};