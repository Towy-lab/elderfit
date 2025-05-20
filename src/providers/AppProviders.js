import React from 'react';
import { AuthProvider } from './AuthProvider';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { ContentProvider } from '../contexts/ContentContext';
import { SafetyProvider } from '../contexts/SafetyContext';
import { ExerciseProvider } from '../contexts/ExerciseContext';

// Comment out or conditionally include providers that might not exist
// import { SafetyProvider } from './SafetyProvider';
// import { SchedulingProvider } from './SchedulingProvider';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <ContentProvider>
          <SafetyProvider>
            <ExerciseProvider>
              {/* Temporarily remove the missing providers */}
              {children}
            </ExerciseProvider>
          </SafetyProvider>
        </ContentProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
};