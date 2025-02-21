import React from 'react';
import { AuthProvider } from './AuthProvider';
import { SafetyProvider } from './SafetyProvider';
import { SchedulingProvider } from './SchedulingProvider';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <SafetyProvider>
        <SchedulingProvider>
          {children}
        </SchedulingProvider>
      </SafetyProvider>
    </AuthProvider>
  );
};