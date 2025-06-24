import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.js';
import { useExercises } from '../contexts/ExerciseContext.js';

export const useWorkoutHistory = () => {
  const { user } = useAuth();
  const { workoutHistory: contextHistory, getWorkoutStats } = useExercises();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const getWorkoutHistory = () => {
    if (!contextHistory || contextHistory.length === 0) {
      return [];
    }
    
    return contextHistory.map(workout => ({
      id: workout.id,
      date: new Date(workout.completedAt),
      completed: true,
      exercises: workout.completedExercises.map(exercise => ({
        id: exercise.exerciseId,
        completed: true,
        difficultyRating: 3, // Default difficulty rating
        userRating: 4 // Default user rating
      }))
    }));
  };

  return {
    workoutHistory: getWorkoutHistory(),
    loading,
    error,
    refreshHistory: () => setLoading(true)
  };
};
