import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSubscription } from './SubscriptionContext';
import { getProgressData, saveWorkoutProgress, getWorkoutHistory } from '../services/api';

// Create the context
const ProgressContext = createContext();

// Create a custom hook to use the progress context
export const useProgress = () => {
  return useContext(ProgressContext);
};

// Helper function to validate workout data
const hasValidWorkoutData = (data) => {
  if (!data) return false;
  
  // Check if workouts array has valid entries
  const hasValidWorkouts = Array.isArray(data.workouts) && 
    data.workouts.length > 0 &&
    data.workouts.some(w => 
      w.completedAt && 
      w.exercisesCompleted?.length > 0 &&
      w.duration > 0
    );

  // Check if workout history has valid entries
  const hasValidHistory = Array.isArray(data.workoutHistory) && 
    data.workoutHistory.length > 0 &&
    data.workoutHistory.some(w => 
      w.completedAt && 
      w.exercisesCompleted?.length > 0 &&
      w.duration > 0
    );

  // Check if streak and totalWorkouts are backed by real data
  const hasValidStats = (
    (data.streak > 0 && data.lastWorkout && hasValidHistory) ||
    (data.totalWorkouts > 0 && hasValidHistory)
  );

  return hasValidWorkouts || hasValidHistory || hasValidStats;
};

// Create the provider component
export const ProgressProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { subscription } = useSubscription();
  const [workouts, setWorkouts] = useState([]);
  const [streak, setStreak] = useState(0);
  const [lastWorkout, setLastWorkout] = useState(null);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reset progress data
  const resetProgress = () => {
    console.log('Resetting progress data');
    setWorkouts([]);
    setStreak(0);
    setLastWorkout(null);
    setTotalWorkouts(0);
    setWorkoutHistory([]);
    setError(null);
  };

  // Load progress data when auth state or subscription changes
  useEffect(() => {
    const loadProgressData = async () => {
      if (!isAuthenticated || !user) {
        resetProgress();
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get progress data from API
        const progressData = await getProgressData();
        console.log('Loaded progress data:', progressData);

        // Validate the data
        if (!hasValidWorkoutData(progressData)) {
          console.log('Invalid progress data, resetting state');
          resetProgress();
          return;
        }

        // Update state with validated data
        setWorkouts(progressData.workouts || []);
        setStreak(progressData.streak || 0);
        setLastWorkout(progressData.lastWorkout || null);
        setTotalWorkouts(progressData.totalWorkouts || 0);

        // Get and validate workout history
        const historyData = await getWorkoutHistory();
        if (historyData.history && Array.isArray(historyData.history)) {
          const validHistory = historyData.history.filter(w => 
            w.completedAt && 
            w.exercisesCompleted?.length > 0 &&
            w.duration > 0
          );
          setWorkoutHistory(validHistory);
          setTotalWorkouts(validHistory.length);
        } else {
          setWorkoutHistory([]);
          setTotalWorkouts(0);
        }
      } catch (err) {
        console.error('Error loading progress data:', err);
        setError(err.message);
        resetProgress();
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgressData();

    // Cleanup function to reset progress when unmounting or auth changes
    return () => {
      if (!isAuthenticated) {
        resetProgress();
      }
    };
  }, [isAuthenticated, user, subscription?.tier]);

  // Track workout completion
  const completeWorkout = async (workoutId, exercisesCompleted, duration) => {
    if (!isAuthenticated) return false;
    
    try {
      setError(null);
      
      // Validate workout data
      if (!workoutId || !exercisesCompleted || !Array.isArray(exercisesCompleted) || exercisesCompleted.length === 0) {
        throw new Error('Invalid workout data');
      }

      // Validate duration
      if (!duration || duration <= 0) {
        throw new Error('Invalid workout duration');
      }
      
      // Save workout progress to API
      const response = await saveWorkoutProgress(workoutId, exercisesCompleted, duration);
      
      // Validate the response data
      if (!response.progress || !response.progress.lastWorkout) {
        throw new Error('Invalid response from server');
      }
      
      // Update local state with the response
      setStreak(response.progress.streak > 0 ? response.progress.streak : 0);
      setLastWorkout(response.progress.lastWorkout);
      
      // Refresh workout history
      const historyData = await getWorkoutHistory();
      if (historyData.history && Array.isArray(historyData.history)) {
        const validHistory = historyData.history.filter(w => 
          w.completedAt && 
          w.exercisesCompleted?.length > 0 &&
          w.duration > 0
        );
        setWorkoutHistory(validHistory);
        setTotalWorkouts(validHistory.length);
      } else {
        setWorkoutHistory([]);
        setTotalWorkouts(0);
      }
      
      return true;
    } catch (error) {
      console.error('Error completing workout:', error);
      setError(error.message);
      return false;
    }
  };

  // Value object to be provided to consumers
  const value = {
    workouts,
    streak,
    lastWorkout,
    totalWorkouts,
    workoutHistory,
    isLoading,
    error,
    completeWorkout
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
};

export default ProgressContext;