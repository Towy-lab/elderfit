// src/contexts/SafetyContext.js
import React, { createContext, useState, useContext } from 'react';

const SafetyContext = createContext();

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};

export const SafetyProvider = ({ children }) => {
  const [painLevels, setPainLevels] = useState({});
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [formGuidance, setFormGuidance] = useState({});

  const value = {
    painLevels,
    setPainLevels,
    emergencyContacts,
    setEmergencyContacts,
    formGuidance,
    setFormGuidance
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
};