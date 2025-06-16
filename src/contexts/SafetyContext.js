// src/contexts/SafetyContext.js - Enhanced with tier awareness
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSubscription } from './SubscriptionContext';
import { useAuth } from './AuthContext';
import { 
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  getSafetyScore,
  getSafetyHistory
} from '../services/api';

const SafetyContext = createContext();

const LOCAL_STORAGE_KEYS = {
  EMERGENCY_CONTACTS: 'elderfit_emergency_contacts',
  PAIN_HISTORY: 'elderfit_pain_history',
  EXERCISE_HISTORY: 'elderfit_exercise_history',
  FORM_CHECKS: 'elderfit_form_checks'
};

export const SafetyProvider = ({ children }) => {
  const { user } = useAuth();
  const { hasAccess } = useSubscription();
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EMERGENCY_CONTACTS);
    return saved ? JSON.parse(saved) : [];
  });
  const [painHistory, setPainHistory] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PAIN_HISTORY);
    return saved ? JSON.parse(saved) : {};
  });
  const [exerciseHistory, setExerciseHistory] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EXERCISE_HISTORY);
    return saved ? JSON.parse(saved) : {};
  });
  const [formChecks, setFormChecks] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FORM_CHECKS);
    return saved ? JSON.parse(saved) : {};
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const addContact = (contact) => {
    if (!hasAccess('premium') && contacts.length >= 1) {
      console.warn('Basic tier users can only add 1 emergency contact. Upgrade to add more.');
      return false;
    }
    
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

  const logPainLevel = (exerciseId, painData) => {
    if (!hasAccess('premium')) {
      console.warn('Pain tracking is a Premium feature. Please upgrade to use it.');
      return false;
    }
    
    setPainHistory(prev => ({
      ...prev,
      [exerciseId]: [painData, ...(prev[exerciseId] || [])]
    }));
    
    return true;
  };

  const getPainHistory = (exerciseId) => {
    if (!hasAccess('premium')) {
      return [];
    }
    
    const history = painHistory[exerciseId] || [];
    
    if (hasAccess('elite')) {
      return history.map(entry => ({
        ...entry,
        insights: generatePainInsights(entry),
      }));
    }
    
    return history;
  };
  
  const generatePainInsights = (painEntry) => {
    if (!hasAccess('elite')) return null;
    
    if (painEntry.level >= 2) {
      return "Consider consulting with a professional about this pain level.";
    } else if (painEntry.level === 1) {
      return "This is normal discomfort during exercise.";
    } else {
      return "Great job! Pain-free exercise is ideal.";
    }
  };

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

  const getExerciseHistory = (exerciseId) => {
    const history = exerciseHistory[exerciseId] || [];
    
    if (!hasAccess('premium')) {
      return history.slice(0, 5);
    }
    
    return history;
  };

  const getLastWorkout = (exerciseId) => {
    const history = exerciseHistory[exerciseId] || [];
    return history[0]?.timestamp || null;
  };

  const logFormCheck = (exerciseId, checkData) => {
    if (!hasAccess('premium')) {
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
    if (!hasAccess('premium')) {
      return [];
    }
    
    return formChecks[exerciseId] || [];
  };

  const getFatigueLevel = () => {
    const recentWorkouts = Object.values(exerciseHistory)
      .flat()
      .filter(workout => {
        const workoutDate = new Date(workout.timestamp);
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        return workoutDate >= threeDaysAgo;
      });

    const baseLevel = Math.min(recentWorkouts.length * 2, 10);
    
    const recentPain = Object.values(painHistory)
      .flat()
      .filter(pain => {
        const painDate = new Date(pain.timestamp);
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        return painDate >= twoDaysAgo;
      });

    const painAdjustment = Math.min(recentPain.reduce((sum, pain) => sum + pain.level, 0), 3);
    
    if (hasAccess('elite')) {
      const advancedFatigueScore = Math.max(0, Math.min(10, baseLevel + painAdjustment - 1));
      return advancedFatigueScore;
    }

    return Math.min(baseLevel + painAdjustment, 10);
  };
  
  const getSafetyScore = () => {
    if (!hasAccess('elite')) return null;
    
    const baseScore = 75;
    
    const contactAdjustment = Math.min(contacts.length * 5, 10);
    
    const formCheckCount = Object.values(formChecks).flat().length;
    const formAdjustment = Math.min(formCheckCount, 10);
    
    const fatigueLevel = getFatigueLevel();
    const fatigueAdjustment = (10 - fatigueLevel) * 0.5;
    
    const totalScore = Math.min(100, baseScore + contactAdjustment + formAdjustment + fatigueAdjustment);
    
    return Math.round(totalScore);
  };
  
  const getSafetyRecommendations = () => {
    if (!hasAccess('elite')) return [];
    
    const recommendations = [];
    
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

  const getRestRecommendations = (exerciseId) => {
    const lastWorkout = getLastWorkout(exerciseId);
    const fatigueLevel = getFatigueLevel();
    
    const getReadiness = () => {
      if (!lastWorkout) return 'ready';
      
      const hoursSinceLastWorkout = (Date.now() - new Date(lastWorkout).getTime()) / (1000 * 60 * 60);
      const recommendedRest = getRestRecommendation();
      
      if (hoursSinceLastWorkout < recommendedRest * 0.5) return 'notReady';
      if (hoursSinceLastWorkout < recommendedRest) return 'cautious';
      return 'ready';
    };

    const getRestRecommendation = () => {
      const baseRest = {
        low: 24,
        moderate: 48,
        high: 72
      }['moderate']; // Default to moderate intensity

      // Adjust based on fatigue level
      const fatigueMultiplier = 1 + (fatigueLevel / 10);
      
      return Math.round(baseRest * fatigueMultiplier);
    };

    return {
      readiness: getReadiness(),
      details: {
        recommendedHours: getRestRecommendation(),
        fatigueLevel,
        lastWorkout
      }
    };
  };

  const hasPremiumAccess = () => hasAccess('premium');
  
  const hasEliteAccess = () => hasAccess('elite');

  const value = {
    contacts,
    loading,
    error,
    addContact,
    removeContact,
    updateContact,
    logPainLevel,
    getPainHistory,
    generatePainInsights,
    logExercise,
    getExerciseHistory,
    getLastWorkout,
    logFormCheck,
    getFormChecks,
    getFatigueLevel,
    getSafetyScore,
    getSafetyRecommendations,
    getRestRecommendations,
    hasPremiumAccess,
    hasEliteAccess
  };

  return (
    <SafetyContext.Provider value={value}>
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => {
  const context = useContext(SafetyContext);
  if (context === undefined) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
};

export default SafetyContext;