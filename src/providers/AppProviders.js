import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { ContentProvider } from '../contexts/ContentContext';
import { SafetyProvider } from '../contexts/SafetyContext';

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