// src/providers/AppProviders.js
import React from 'react';
import { SafetyProvider } from '../contexts/SafetyContext';
import { SchedulingProvider } from '../contexts/SchedulingContext';

const AppProviders = ({ children }) => {
  return (
    <SafetyProvider>
      <SchedulingProvider>
        {children}
      </SchedulingProvider>
    </SafetyProvider>
  );
};

export default AppProviders;