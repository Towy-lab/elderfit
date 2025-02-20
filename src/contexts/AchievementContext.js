import React, { createContext, useContext, useState, useEffect } from 'react';

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
  // Achievement state
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS);
    return saved ? JSON.parse(saved) : {
      earnedBadges: [],
      totalWorkouts: 0,
      uniqueExercises: new Set(),
      weeklyGoalsStreak: 0
    };
  });

  // Streak state
  const [streaks, setStreaks] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.STREAKS);
    return saved ? JSON.parse(saved) : {
      currentStreak: 0,
      bestStreak: 0,
      lastWorkout: null,
      workoutDates: []
    };
  });

  // Goals state
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.GOALS);
    return saved ? JSON.parse(saved) : {
      weekly: [
        {
          id: 'workouts',
          name: 'Weekly Workouts',
          target: 3,
          current: 0,
          unit: 'workouts'
        },
        {
          id: 'minutes',
          name: 'Exercise Minutes',
          target: 90,
          current: 0,
          unit: 'minutes'
        },
        {
          id: 'strength',
          name: 'Strength Exercises',
          target: 2,
          current: 0,
          unit: 'sessions'
        }
      ],
      lastReset: new Date().toISOString()
    };
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.STREAKS, JSON.stringify(streaks));
  }, [streaks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  // Check and update streaks
  const updateStreak = () => {
    const today = new Date();
    const lastWorkout = streaks.lastWorkout ? new Date(streaks.lastWorkout) : null;
    
    if (!lastWorkout) {
      setStreaks(prev => ({
        ...prev,
        currentStreak: 1,
        bestStreak: 1,
        lastWorkout: today.toISOString(),
        workoutDates: [today.toISOString()]
      }));
      return;
    }

    const daysSinceLastWorkout = Math.floor(
      (today - lastWorkout) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastWorkout <= 1) {
      // Maintain or increment streak
      const newCurrentStreak = daysSinceLastWorkout === 0 
        ? streaks.currentStreak 
        : streaks.currentStreak + 1;

      setStreaks(prev => ({
        ...prev,
        currentStreak: newCurrentStreak,
        bestStreak: Math.max(newCurrentStreak, prev.bestStreak),
        lastWorkout: today.toISOString(),
        workoutDates: [...prev.workoutDates, today.toISOString()]
      }));
    } else {
      // Break streak
      setStreaks(prev => ({
        ...prev,
        currentStreak: 1,
        lastWorkout: today.toISOString(),
        workoutDates: [today.toISOString()]
      }));
    }
  };

  // Log a completed workout
  const logWorkout = (workout) => {
    updateStreak();
    
    // Update total workouts
    setAchievements(prev => ({
      ...prev,
      totalWorkouts: prev.totalWorkouts + 1,
      uniqueExercises: new Set([...prev.uniqueExercises, ...workout.exercises.map(e => e.id)])
    }));

    // Update weekly goals
    setGoals(prev => ({
      ...prev,
      weekly: prev.weekly.map(goal => {
        if (goal.id === 'workouts') {
          return { ...goal, current: goal.current + 1 };
        }
        if (goal.id === 'minutes') {
          return { ...goal, current: goal.current + workout.duration };
        }
        if (goal.id === 'strength' && workout.type === 'strength') {
          return { ...goal, current: goal.current + 1 };
        }
        return goal;
      })
    }));

    checkForNewAchievements();
  };

  // Check for new achievements
  const checkForNewAchievements = () => {
    const newBadges = [];

    // Check First Workout
    if (achievements.totalWorkouts === 1 && !achievements.earnedBadges.includes(BADGES.FIRST_WORKOUT.id)) {
      newBadges.push(BADGES.FIRST_WORKOUT.id);
    }

    // Check Week Streak
    if (streaks.currentStreak >= 7 && !achievements.earnedBadges.includes(BADGES.WEEK_STREAK.id)) {
      newBadges.push(BADGES.WEEK_STREAK.id);
    }

    // Check Variety Master
    if (achievements.uniqueExercises.size >= 5 && !achievements.earnedBadges.includes(BADGES.VARIETY_MASTER.id)) {
      newBadges.push(BADGES.VARIETY_MASTER.id);
    }

    if (newBadges.length > 0) {
      setAchievements(prev => ({
        ...prev,
        earnedBadges: [...prev.earnedBadges, ...newBadges]
      }));
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