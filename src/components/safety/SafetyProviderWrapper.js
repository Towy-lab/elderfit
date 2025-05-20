import React from 'react';
import { SafetyProvider } from '../../contexts/SafetyContext';

const SafetyProviderWrapper = ({ children }) => {
  return <SafetyProvider>{children}</SafetyProvider>;
};

export default SafetyProviderWrapper;
