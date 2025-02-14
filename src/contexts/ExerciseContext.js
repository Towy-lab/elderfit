import React, { createContext, useContext, useState } from 'react';

const ExerciseContext = createContext();

export const ExerciseProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      name: 'Morning Mobility',
      description: 'Gentle exercises to start your day',
      duration: 900, // 15 minutes in seconds
      exercises: []
    },
    {
      id: 2,
      name: 'Chair Strength',
      description: 'Build strength with chair-supported exercises',
      duration: 1200, // 20 minutes in seconds
      exercises: []
    }
  ]);

  const value = {
    favorites,
    workouts,
    toggleFavorite: (id) => {
      setFavorites(prev => 
        prev.includes(id) 
          ? prev.filter(fav => fav !== id)
          : [...prev, id]
      );
    },
    isFavorite: (id) => favorites.includes(id),
    addWorkout: (workout) => {
      setWorkouts(prev => [...prev, workout]);
    },
    getWorkoutById: (id) => workouts.find(w => w.id === id)
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