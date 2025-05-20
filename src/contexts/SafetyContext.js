// src/contexts/SafetyContext.js - Enhanced with tier awareness
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSubscription } from './SubscriptionContext';

const SafetyContext = createContext();

const LOCAL_STORAGE_KEYS = {
  EMERGENCY_CONTACTS: 'elderfit_emergency_contacts',
  PAIN_HISTORY: 'elderfit_pain_history',
  EXERCISE_HISTORY: 'elderfit_exercise_history',
  FORM_CHECKS: 'elderfit_form_checks'
};

export const SafetyProvider = ({ children }) => {
  const { hasTierAccess } = useSubscription();

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

  // Emergency Contact Methods - Tier-Aware
  const addContact = (contact) => {
    // Basic tier is limited to 1 contact only
    if (!hasTierAccess('premium') && contacts.length >= 1) {
      console.warn('Basic tier users can only add 1 emergency contact. Upgrade to add more.');
      return false;
    }
    
    // Premium tier gets unlimited contacts
    setContacts(prev => [...prev, contact]);
    return true;
  };

  const removeContact = (index) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
    return true;
  };

  const updateContact = (index, updatedContact) => {
    setContacts(prev => prev.map((contact, i) => 
      i === index ? updatedContact : contact
    ));
    return true;
  };

  // Pain Tracking Methods - Tier-Aware
  const logPainLevel = (exerciseId, painData) => {
    // Premium feature check
    if (!hasTierAccess('premium')) {
      console.warn('Pain tracking is a Premium feature. Please upgrade to use it.');
      return false;
    }
    
    setPainHistory(prev => ({
      ...prev,
      [exerciseId]: [painData, ...(prev[exerciseId] || [])]
    }));
    
    return true;
  };

  // Get pain history with tier restriction
  const getPainHistory = (exerciseId) => {
    // Basic tier can't access pain history
    if (!hasTierAccess('premium')) {
      return [];
    }
    
    // Premium and Elite get full history
    const history = painHistory[exerciseId] || [];
    
    // Elite gets enhanced analysis
    if (hasTierAccess('elite')) {
      // Add trend analysis and insights for Elite users
      return history.map(entry => ({
        ...entry,
        insights: generatePainInsights(entry),
      }));
    }
    
    return history;
  };
  
  // Generate pain insights for Elite tier
  const generatePainInsights = (painEntry) => {
    if (!hasTierAccess('elite')) return null;
    
    // This would be more sophisticated in production
    if (painEntry.level >= 2) {
      return "Consider consulting with a professional about this pain level.";
    } else if (painEntry.level === 1) {
      return "This is normal discomfort during exercise.";
    } else {
      return "Great job! Pain-free exercise is ideal.";
    }
  };

  // Exercise History Methods - Tier-Aware
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
    
    return true;
  };

  // Get exercise history with tier restrictions
  const getExerciseHistory = (exerciseId) => {
    const history = exerciseHistory[exerciseId] || [];
    
    // Basic tier gets limited history (last 5 entries)
    if (!hasTierAccess('premium')) {
      return history.slice(0, 5);
    }
    
    // Premium gets full history
    return history;
  };

  // Get last workout time
  const getLastWorkout = (exerciseId) => {
    const history = exerciseHistory[exerciseId] || [];
    return history[0]?.timestamp || null;
  };

  // Form Check Methods - Tier-Aware
  const logFormCheck = (exerciseId, checkData) => {
    // Premium feature check
    if (!hasTierAccess('premium')) {
      console.warn('Form tracking is a Premium feature. Please upgrade to use it.');
      return false;
    }
    
    setFormChecks(prev => ({
      ...prev,
      [exerciseId]: [checkData, ...(prev[exerciseId] || [])]
    }));
    
    return true;
  };

  const getFormChecks = (exerciseId) => {
    // Basic tier can't access form checks
    if (!hasTierAccess('premium')) {
      return [];
    }
    
    return formChecks[exerciseId] || [];
  };

  // Fatigue Level Calculation - Enhanced for Elite tier
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
    
    // Elite tier gets more personalized fatigue calculation
    if (hasTierAccess('elite')) {
      // Advanced algorithm would go here - simplified for example
      // Consider age, fitness level, recovery rate
      const advancedFatigueScore = Math.max(0, Math.min(10, baseLevel + painAdjustment - 1));
      return advancedFatigueScore;
    }

    // Standard calculation for Basic/Premium
    return Math.min(baseLevel + painAdjustment, 10);
  };
  
  // Get safety score - Elite-only feature
  const getSafetyScore = () => {
    if (!hasTierAccess('elite')) return null;
    
    // Calculate safety score (0-100) based on various factors
    // This would be more sophisticated in production
    const baseScore = 75;
    
    // Adjust for emergency contacts
    const contactAdjustment = Math.min(contacts.length * 5, 10);
    
    // Adjust for form checks
    const formCheckCount = Object.values(formChecks).flat().length;
    const formAdjustment = Math.min(formCheckCount, 10);
    
    // Adjust for fatigue (inverse relationship)
    const fatigueLevel = getFatigueLevel();
    const fatigueAdjustment = (10 - fatigueLevel) * 0.5;
    
    const totalScore = Math.min(100, baseScore + contactAdjustment + formAdjustment + fatigueAdjustment);
    
    return Math.round(totalScore);
  };
  
  // Get personalized safety recommendations - Elite-only feature
  const getSafetyRecommendations = () => {
    if (!hasTierAccess('elite')) return [];
    
    const recommendations = [];
    
    // This would be more sophisticated in production
    if (contacts.length < 2) {
      recommendations.push({
        type: 'emergency',
        message: 'Add at least 2 emergency contacts for better safety coverage'
      });
    }
    
    const fatigueLevel = getFatigueLevel();
    if (fatigueLevel > 7) {
      recommendations.push({
        type: 'rest',
        message: 'Your fatigue level is high. Consider additional rest days.'
      });
    }
    
    return recommendations;
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
    generatePainInsights,
    
    // Exercise History
    logExercise,
    getExerciseHistory,
    getLastWorkout,
    
    // Form Checks
    logFormCheck,
    getFormChecks,
    
    // Fatigue Management
    getFatigueLevel,
    
    // Elite Features
    getSafetyScore,
    getSafetyRecommendations,
    
    // Tier Check Helper
    hasPremiumAccess: () => hasTierAccess('premium'),
    hasEliteAccess: () => hasTierAccess('elite')
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