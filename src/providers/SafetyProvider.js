// src/providers/SafetyProvider.js
import React, { createContext, useContext, useState } from 'react';

const SafetyContext = createContext(null);

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};

export const SafetyProvider = ({ children }) => {
  const [painLevels, setPainLevels] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const addPainEntry = (entry) => {
    setPainLevels(prev => [...prev, { ...entry, timestamp: new Date() }]);
  };

  const addEmergencyContact = (contact) => {
    setEmergencyContacts(prev => [...prev, contact]);
  };

  const value = {
    painLevels,
    emergencyContacts,
    addPainEntry,
    addEmergencyContact,
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
};