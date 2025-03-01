import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create the context
const ProgressContext = createContext();

// Create a custom hook to use the progress context
export const useProgress = () => {
  return useContext(ProgressContext);
};

// Create the provider component
export const ProgressProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [streak, setStreak] = useState(0);
  const [lastWorkout, setLastWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress data when the component mounts or auth changes
  useEffect(() => {
    const loadProgressData = () => {
      try {
        console.log("Loading progress data for user:", user?.id);
        
        if (isAuthenticated && user) {
          // In a real app, this would fetch from an API
          // For now, we'll use mock data or localStorage
          const storedProgress = localStorage.getItem('userProgress');
          
          if (storedProgress) {
            const progressData = JSON.parse(storedProgress);
            console.log("Found progress data:", progressData);
            
            setWorkouts(progressData.workouts || []);
            setStreak(progressData.streak || 0);
            setLastWorkout(progressData.lastWorkout || null);
          } else {
            // No stored progress, initialize with defaults
            console.log("No progress data found, initializing with defaults");
            
            // Mock default data
            const defaultProgress = {
              workouts: [],
              streak: 0,
              lastWorkout: null
            };
            
            setWorkouts(defaultProgress.workouts);
            setStreak(defaultProgress.streak);
            setLastWorkout(defaultProgress.lastWorkout);
            
            // Store the defaults
            localStorage.setItem('userProgress', JSON.stringify(defaultProgress));
          }
        } else {
          // Reset progress for unauthenticated users
          console.log("No authenticated user, resetting progress");
          setWorkouts([]);
          setStreak(0);
          setLastWorkout(null);
        }
      } catch (error) {
        console.error('Error loading progress data:', error);
        // Set to defaults on error
        setWorkouts([]);
        setStreak(0);
        setLastWorkout(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgressData();
  }, [isAuthenticated, user]);

  // Track workout completion
  const completeWorkout = (workoutId, exercisesCompleted) => {
    if (!isAuthenticated) return false;
    
    try {
      const now = new Date();
      const completionDate = now.toISOString();
      
      // Create the workout completion record
      const completedWorkout = {
        id: workoutId,
        completedAt: completionDate,
        exercisesCompleted
      };
      
      // Update workouts list
      const updatedWorkouts = [...workouts, completedWorkout];
      setWorkouts(updatedWorkouts);
      
      // Update last workout
      setLastWorkout(completionDate);
      
      // Calculate streak
      // In a real app, this would have more complex logic
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Save to localStorage
      localStorage.setItem('userProgress', JSON.stringify({
        workouts: updatedWorkouts,
        streak: newStreak,
        lastWorkout: completionDate
      }));
      
      return true;
    } catch (error) {
      console.error('Error completing workout:', error);
      return false;
    }
  };

  // Value object to be provided to consumers
  const value = {
    workouts,
    streak,
    lastWorkout,
    isLoading,
    completeWorkout
  };
  
  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressContext;