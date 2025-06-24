// src/hooks/useScheduling.js
import { useContext } from 'react';
import { SchedulingContext } from '../providers/SchedulingProvider.js';

export const useScheduling = () => {
  const context = useContext(SchedulingContext);
  if (!context) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
};