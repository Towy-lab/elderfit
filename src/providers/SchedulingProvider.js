// src/providers/SchedulingProvider.js
import React, { createContext, useState, useCallback, useContext } from 'react';

const SchedulingContext = createContext(null);

export const useScheduling = () => {
  const context = useContext(SchedulingContext);
  if (!context) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
};

export const SchedulingProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [restDays, setRestDays] = useState([]);
  const [reminders, setReminders] = useState([]);

  const addWorkout = useCallback((workout) => {
    setWorkouts(prev => [...prev, workout]);
  }, []);

  const updateWorkout = useCallback((id, updatedWorkout) => {
    setWorkouts(prev => 
      prev.map(workout => workout.id === id ? updatedWorkout : workout)
    );
  }, []);

  const deleteWorkout = useCallback((id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  }, []);

  const addRestDay = useCallback((date) => {
    setRestDays(prev => [...prev, date]);
  }, []);

  const setReminder = useCallback((reminder) => {
    setReminders(prev => [...prev, reminder]);
  }, []);

  const value = {
    workouts,
    restDays,
    reminders,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    addRestDay,
    setReminder,
  };

  return (
    <SchedulingContext.Provider value={value}>
      {children}
    </SchedulingContext.Provider>
  );
};