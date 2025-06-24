import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProgressData } from '../services/progressService.js';
import { hasValidWorkoutData } from '../utils/workoutUtils';

const AchievementContext = createContext();

const LOCAL_STORAGE_KEYS = {
  ACHIEVEMENTS: 'elderfit_achievements',
  STREAKS: 'elderfit_streaks',
  GOALS: 'elderfit_goals'
};

// Badge definitions
const BADGES = {
  FIRST_WORKOUT: {
    id: 'first-workout',
    name: 'First Step',
    description: 'Complete your first workout',
    category: 'BEGINNER',
    requirement: '1 workout completed'
  },
  WEEK_STREAK: {
    id: 'week-streak',
    name: 'Week Warrior',
    description: 'Complete a 7-day streak',
    category: 'BEGINNER',
    requirement: '7 day streak'
  },
  VARIETY_MASTER: {
    id: 'variety-master',
    name: 'Variety Master',
    description: 'Try 5 different exercises',
    category: 'INTERMEDIATE',
    requirement: '5 different exercises'
  },
  CONSISTENCY_KING: {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Complete all weekly goals for 4 weeks',
    category: 'ADVANCED',
    requirement: '4 weeks of completed goals'
  }
  // Add more badge definitions as needed
};

export const AchievementProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // Achievement state
  const [achievements, setAchievements] = useState({
    earnedBadges: [],
    totalWorkouts: 0,
    uniqueExercises: new Set(),
    weeklyGoalsStreak: 0
  });

  // Streak state
  const [streaks, setStreaks] = useState({
    currentStreak: 0,
    bestStreak: 0,
    lastWorkout: null,
    workoutDates: []
  });

  // Goals state
  const [goals, setGoals] = useState({
    weekly: [],
    lastReset: new Date().toISOString()
  });

  // Reset all data
  const resetData = () => {
    setAchievements({
      earnedBadges: [],
      totalWorkouts: 0,
      uniqueExercises: new Set(),
      weeklyGoalsStreak: 0
    });
    setStreaks({
      currentStreak: 0,
      bestStreak: 0,
      lastWorkout: null,
      workoutDates: []
    });
    setGoals({
      weekly: [],
      lastReset: new Date().toISOString()
    });
  };

  // Load data from server when auth changes
  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated || !user) {
        resetData();
        return;
      }

      try {
        const progressData = await getProgressData();
        
        if (!progressData || !hasValidWorkoutData(progressData)) {
          resetData();
          return;
        }

        // Update achievements
        setAchievements(prev => ({
          ...prev,
          totalWorkouts: progressData.totalWorkouts || 0,
          earnedBadges: progressData.achievements?.filter(a => a.earnedAt) || []
        }));

        // Update streaks
        setStreaks(prev => ({
          ...prev,
          currentStreak: progressData.streak || 0,
          lastWorkout: progressData.lastWorkout || null
        }));

        // Update goals
        if (progressData.workoutHistory?.length > 0) {
          const weeklyGoals = calculateWeeklyGoals(progressData.workoutHistory);
          setGoals(prev => ({
            ...prev,
            weekly: weeklyGoals
          }));
        }
      } catch (error) {
        console.error('Error loading achievement data:', error);
        resetData();
      }
    };

    loadData();
  }, [isAuthenticated, user]);

  // Helper function to calculate weekly goals from workout history
  const calculateWeeklyGoals = (workoutHistory) => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    
    const thisWeekWorkouts = workoutHistory.filter(w => 
      new Date(w.completedAt) >= weekStart
    );

    const totalMinutes = thisWeekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    const strengthWorkouts = thisWeekWorkouts.filter(w => 
      w.exercisesCompleted?.some(e => e.type === 'strength')
    ).length;

    return [
      {
        id: 'workouts',
        name: 'Weekly Workouts',
        target: 3,
        current: thisWeekWorkouts.length,
        unit: 'workouts'
      },
      {
        id: 'minutes',
        name: 'Exercise Minutes',
        target: 90,
        current: Math.floor(totalMinutes / 60),
        unit: 'minutes'
      },
      {
        id: 'strength',
        name: 'Strength Exercises',
        target: 2,
        current: strengthWorkouts,
        unit: 'sessions'
      }
    ];
  };

  // Log a completed workout
  const logWorkout = async (workout) => {
    if (!isAuthenticated) return;

    try {
      const progressData = await getProgressData();
      if (!progressData || !hasValidWorkoutData(progressData)) {
        return;
      }

      // Update achievements
      setAchievements(prev => ({
        ...prev,
        totalWorkouts: progressData.totalWorkouts || 0,
        uniqueExercises: new Set([...prev.uniqueExercises, ...workout.exercises.map(e => e.id)])
      }));

      // Update streaks
      setStreaks(prev => ({
        ...prev,
        currentStreak: progressData.streak || 0,
        lastWorkout: progressData.lastWorkout || null
      }));

      // Update goals
      if (progressData.workoutHistory?.length > 0) {
        const weeklyGoals = calculateWeeklyGoals(progressData.workoutHistory);
        setGoals(prev => ({
          ...prev,
          weekly: weeklyGoals
        }));
      }
    } catch (error) {
      console.error('Error updating achievement data:', error);
    }
  };

  // Reset weekly goals
  const resetWeeklyGoals = () => {
    setGoals(prev => ({
      ...prev,
      weekly: prev.weekly.map(goal => ({ ...goal, current: 0 })),
      lastReset: new Date().toISOString()
    }));
  };

  // Check if weekly goals need to be reset
  useEffect(() => {
    const lastReset = new Date(goals.lastReset);
    const today = new Date();
    const daysSinceReset = Math.floor((today - lastReset) / (1000 * 60 * 60 * 24));

    if (daysSinceReset >= 7) {
      resetWeeklyGoals();
    }
  }, [goals.lastReset]);

  const value = {
    achievements,
    streaks,
    goals,
    logWorkout,
    resetWeeklyGoals,
    BADGES,
    earnedBadges: achievements.earnedBadges,
    totalWorkouts: achievements.totalWorkouts,
    currentStreak: streaks.currentStreak,
    bestStreak: streaks.bestStreak,
    weeklyGoals: goals.weekly,
    // Helper methods
    isGoalComplete: (goalId) => {
      const goal = goals.weekly.find(g => g.id === goalId);
      return goal ? goal.current >= goal.target : false;
    },
    getGoalProgress: (goalId) => {
      const goal = goals.weekly.find(g => g.id === goalId);
      return goal ? (goal.current / goal.target) * 100 : 0;
    }
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};

export default AchievementContext;