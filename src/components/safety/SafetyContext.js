import React, { createContext, useContext, useState, useEffect } from 'react';

const SafetyContext = createContext();

const LOCAL_STORAGE_KEYS = {
  EMERGENCY_CONTACTS: 'elderfit_emergency_contacts',
  PAIN_HISTORY: 'elderfit_pain_history',
  EXERCISE_HISTORY: 'elderfit_exercise_history',
  FORM_CHECKS: 'elderfit_form_checks'
};

export const SafetyProvider = ({ children }) => {
  // Emergency Contacts State
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EMERGENCY_CONTACTS);
    return saved ? JSON.parse(saved) : [];
  });

  // Pain History State
  const [painHistory, setPainHistory] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PAIN_HISTORY);
    return saved ? JSON.parse(saved) : {};
  });

  // Exercise History State
  const [exerciseHistory, setExerciseHistory] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EXERCISE_HISTORY);
    return saved ? JSON.parse(saved) : {};
  });

  // Form Checks State
  const [formChecks, setFormChecks] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FORM_CHECKS);
    return saved ? JSON.parse(saved) : {};
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EMERGENCY_CONTACTS, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PAIN_HISTORY, JSON.stringify(painHistory));
  }, [painHistory]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EXERCISE_HISTORY, JSON.stringify(exerciseHistory));
  }, [exerciseHistory]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FORM_CHECKS, JSON.stringify(formChecks));
  }, [formChecks]);

  // Emergency Contact Methods
  const addContact = (contact) => {
    setContacts(prev => [...prev, contact]);
  };

  const removeContact = (index) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
  };

  const updateContact = (index, updatedContact) => {
    setContacts(prev => prev.map((contact, i) => 
      i === index ? updatedContact : contact
    ));
  };

  // Pain Tracking Methods
  const logPainLevel = (exerciseId, painData) => {
    setPainHistory(prev => ({
      ...prev,
      [exerciseId]: [painData, ...(prev[exerciseId] || [])]
    }));
  };

  const getPainHistory = (exerciseId) => {
    return painHistory[exerciseId] || [];
  };

  // Exercise History Methods
  const logExercise = (exerciseId, data) => {
    setExerciseHistory(prev => ({
      ...prev,
      [exerciseId]: [
        {
          ...data,
          timestamp: new Date().toISOString()
        },
        ...(prev[exerciseId] || [])
      ]
    }));
  };

  const getLastWorkout = (exerciseId) => {
    const history = exerciseHistory[exerciseId] || [];
    return history[0]?.timestamp || null;
  };

  // Form Check Methods
  const logFormCheck = (exerciseId, checkData) => {
    setFormChecks(prev => ({
      ...prev,
      [exerciseId]: [checkData, ...(prev[exerciseId] || [])]
    }));
  };

  const getFormChecks = (exerciseId) => {
    return formChecks[exerciseId] || [];
  };

  // Fatigue Level Calculation
  const getFatigueLevel = () => {
    // Calculate fatigue based on recent exercise volume and intensity
    const recentWorkouts = Object.values(exerciseHistory)
      .flat()
      .filter(workout => {
        const workoutDate = new Date(workout.timestamp);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return workoutDate >= threeDaysAgo;
      });

    // Basic fatigue calculation (0-10 scale)
    const baseLevel = Math.min(recentWorkouts.length * 2, 10);
    
    // Adjust based on pain reports
    const recentPain = Object.values(painHistory)
      .flat()
      .filter(pain => {
        const painDate = new Date(pain.timestamp);
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        return painDate >= twoDaysAgo;
      });

    const painAdjustment = Math.min(recentPain.reduce((sum, pain) => sum + pain.level, 0), 3);

    return Math.min(baseLevel + painAdjustment, 10);
  };

  const value = {
    // Emergency Contacts
    contacts,
    addContact,
    removeContact,
    updateContact,
    
    // Pain Tracking
    logPainLevel,
    getPainHistory,
    
    // Exercise History
    logExercise,
    getLastWorkout,
    
    // Form Checks
    logFormCheck,
    getFormChecks,
    
    // Fatigue Management
    getFatigueLevel
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};

export default SafetyContext;