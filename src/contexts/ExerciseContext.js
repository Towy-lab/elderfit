import React, { createContext, useContext, useState, useEffect } from 'react';

const ExerciseContext = createContext();

const LOCAL_STORAGE_KEYS = {
  FAVORITES: 'elderfit_favorites',
  WORKOUTS: 'elderfit_workouts',
  HISTORY: 'elderfit_history'
};

export const ExerciseProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : [];
  });

  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WORKOUTS);
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Morning Mobility',
        description: 'Gentle exercises to start your day',
        duration: 900,
        exercises: []
      },
      {
        id: 2,
        name: 'Chair Strength',
        description: 'Build strength with chair-supported exercises',
        duration: 1200,
        exercises: []
      }
    ];
  });

  const [workoutHistory, setWorkoutHistory] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.HISTORY, JSON.stringify(workoutHistory));
  }, [workoutHistory]);

  const addWorkoutToHistory = (workoutId, completedExercises, duration) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;

    const historyEntry = {
      id: Date.now(),
      workoutId,
      workoutName: workout.name,
      completedAt: new Date().toISOString(),
      duration,
      completedExercises
    };

    setWorkoutHistory(prev => [historyEntry, ...prev]);
  };

  const updateWorkout = (id, updates) => {
    setWorkouts(prev => 
      prev.map(workout => 
        workout.id === id ? { ...workout, ...updates } : workout
      )
    );
  };

  const deleteWorkout = (id) => {
    setWorkouts(prev => prev.filter(workout => workout.id !== id));
  };

  const getWorkoutStats = (workoutId) => {
    const workoutEntries = workoutHistory.filter(entry => entry.workoutId === workoutId);
    
    return {
      timesCompleted: workoutEntries.length,
      averageDuration: workoutEntries.reduce((acc, entry) => acc + entry.duration, 0) / workoutEntries.length || 0,
      lastCompleted: workoutEntries[0]?.completedAt || null
    };
  };

  const value = {
    favorites,
    workouts,
    workoutHistory,
    toggleFavorite: (id) => {
      setFavorites(prev => 
        prev.includes(id) 
          ? prev.filter(fav => fav !== id)
          : [...prev, id]
      );
    },
    isFavorite: (id) => favorites.includes(id),
    addWorkout: (workout) => {
      const newWorkout = {
        ...workout,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      setWorkouts(prev => [...prev, newWorkout]);
      return newWorkout.id;
    },
    updateWorkout,
    deleteWorkout,
    getWorkoutById: (id) => workouts.find(w => w.id === id),
    addWorkoutToHistory,
    getWorkoutStats,
    getRecentWorkouts: () => workoutHistory.slice(0, 5),
    clearHistory: () => setWorkoutHistory([])
  };

  return (
    <ExerciseContext.Provider value={value}>
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercises = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercises must be used within an ExerciseProvider');
  }
  return context;
};

export default ExerciseContext;