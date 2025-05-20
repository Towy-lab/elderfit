// src/hooks/useSafety.js
import { useContext } from 'react';
import { SafetyContext } from '../providers/SafetyProvider';

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};