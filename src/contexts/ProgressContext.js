import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

// Create the progress context
export const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [userProgress, setUserProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user progress data
  useEffect(() => {
    if (!currentUser) {
      setUserProgress(null);
      setIsLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, you would call your API endpoint
        // const response = await api.get('/progress');
        
        // For now, we'll simulate this with a timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock progress data
        const mockProgressData = {
          workoutsCompleted: 12,
          totalMinutes: 245,
          streak: 3,
          lastWorkout: '2023-08-28',
          achievements: [
            { id: 1, title: 'First Workout', date: '2023-08-15' },
            { id: 2, title: '5 Workouts Completed', date: '2023-08-20' },
            { id: 3, title: '10 Workouts Completed', date: '2023-08-27' }
          ],
          weeklyProgress: [
            { date: '2023-08-21', minutes: 25 },
            { date: '2023-08-22', minutes: 0 },
            { date: '2023-08-23', minutes: 30 },
            { date: '2023-08-24', minutes: 15 },
            { date: '2023-08-25', minutes: 0 },
            { date: '2023-08-26', minutes: 20 },
            { date: '2023-08-27', minutes: 25 }
          ]
        };
        
        setUserProgress(mockProgressData);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load progress data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [currentUser]);

  // Record a completed workout
  const recordWorkout = async (workoutData) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, you would call your API endpoint
      // const response = await api.post('/progress/workout', workoutData);
      
      // For now, we'll simulate this with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local progress data
      setUserProgress(prev => {
        if (!prev) return {
          workoutsCompleted: 1,
          totalMinutes: workoutData.minutes || 0,
          streak: 1,
          lastWorkout: new Date().toISOString().split('T')[0],
          achievements: [],
          weeklyProgress: [
            { date: new Date().toISOString().split('T')[0], minutes: workoutData.minutes || 0 }
          ]
        };
        
        return {
          ...prev,
          workoutsCompleted: prev.workoutsCompleted + 1,
          totalMinutes: prev.totalMinutes + (workoutData.minutes || 0),
          streak: calculateStreak(prev.lastWorkout, prev.streak),
          lastWorkout: new Date().toISOString().split('T')[0],
          weeklyProgress: [
            ...prev.weeklyProgress,
            { date: new Date().toISOString().split('T')[0], minutes: workoutData.minutes || 0 }
          ].slice(-7) // Keep only the last 7 days
        };
      });
      
      return true;
    } catch (err) {
      console.error('Error recording workout:', err);
      setError('Failed to record workout. Please try again later.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to calculate streak
  const calculateStreak = (lastWorkout, currentStreak) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (lastWorkout === yesterday) {
      return currentStreak + 1;
    } else if (lastWorkout === today) {
      return currentStreak;
    } else {
      return 1; // Reset streak
    }
  };

  return (
    <ProgressContext.Provider
      value={{
        userProgress,
        recordWorkout,
        isLoading,
        error
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

// Custom hook for using progress context
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export default ProgressContext;