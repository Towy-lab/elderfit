// src/contexts/SchedulingContext.js
import React, { createContext, useState, useContext } from 'react';

const SchedulingContext = createContext();

export const useScheduling = () => {
  const context = useContext(SchedulingContext);
  if (!context) {
    throw new Error('useScheduling must be used within a SchedulingProvider');
  }
  return context;
};

export const SchedulingProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [reminders, setReminders] = useState([]);

  const value = {
    workouts,
    setWorkouts,
    routines,
    setRoutines,
    reminders,
    setReminders
  };

  return (
    <SchedulingContext.Provider value={value}>
      {children}
    </SchedulingContext.Provider>
  );
};