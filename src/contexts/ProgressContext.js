import React, { createContext, useContext, useState, useEffect } from 'react';

const ProgressContext = createContext();

const LOCAL_STORAGE_KEYS = {
  EXERCISE_HISTORY: 'elderfit_exercise_history',
  DIFFICULTY_LEVELS: 'elderfit_difficulty_levels',
  USER_GOALS: 'elderfit_user_goals'
};

export const ProgressProvider = ({ children }) => {
  // Exercise history with timestamps, modifications, and difficulty
  const [exerciseHistory, setExerciseHistory] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EXERCISE_HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  // User-specific difficulty levels for each exercise
  const [difficultyLevels, setDifficultyLevels] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.DIFFICULTY_LEVELS);
    return saved ? JSON.parse(saved) : {};
  });

  // User goals and progress
  const [userGoals, setUserGoals] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_GOALS);
    return saved ? JSON.parse(saved) : {
      weeklyWorkouts: 3,
      exerciseMinutes: 90,
      focusAreas: []
    };
  });

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EXERCISE_HISTORY, JSON.stringify(exerciseHistory));
  }, [exerciseHistory]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DIFFICULTY_LEVELS, JSON.stringify(difficultyLevels));
  }, [difficultyLevels]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_GOALS, JSON.stringify(userGoals));
  }, [userGoals]);

  // Add exercise session to history
  const logExercise = (exerciseId, data) => {
    const entry = {
      id: Date.now(),
      exerciseId,
      timestamp: new Date().toISOString(),
      duration: data.duration,
      difficulty: data.difficulty,
      modifications: data.modifications || [],
      notes: data.notes,
      completed: data.completed,
      painLevel: data.painLevel,
      energyLevel: data.energyLevel
    };

    setExerciseHistory(prev => [entry, ...prev]);
    updateDifficultyLevel(exerciseId, data.difficulty);
  };

  // Update exercise difficulty based on user performance
  const updateDifficultyLevel = (exerciseId, sessionDifficulty) => {
    setDifficultyLevels(prev => {
      const currentLevel = prev[exerciseId] || { level: 'beginner', confidence: 0 };
      const newConfidence = calculateNewConfidence(currentLevel, sessionDifficulty);
      
      return {
        ...prev,
        [exerciseId]: {
          level: determineLevel(newConfidence),
          confidence: newConfidence
        }
      };
    });
  };

  // Calculate confidence score for difficulty adjustment
  const calculateNewConfidence = (currentLevel, sessionDifficulty) => {
    const difficultyScores = {
      'too easy': 1,
      'just right': 0,
      'too hard': -1
    };
    
    return Math.min(Math.max(
      currentLevel.confidence + difficultyScores[sessionDifficulty],
      -3
    ), 3);
  };

  // Determine difficulty level based on confidence score
  const determineLevel = (confidence) => {
    if (confidence <= -2) return 'beginner';
    if (confidence >= 2) return 'advanced';
    return 'intermediate';
  };

  // Get exercise history for specific exercise
  const getExerciseHistory = (exerciseId) => {
    return exerciseHistory.filter(entry => entry.exerciseId === exerciseId);
  };

  // Get recommended modifications based on history
  const getRecommendedModifications = (exerciseId) => {
    const history = getExerciseHistory(exerciseId);
    const recentEntries = history.slice(0, 5);
    
    return recentEntries.reduce((mods, entry) => {
      entry.modifications.forEach(mod => {
        mods[mod] = (mods[mod] || 0) + 1;
      });
      return mods;
    }, {});
  };

  // Check if user has met their goals
  const checkGoalProgress = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentHistory = exerciseHistory.filter(
      entry => new Date(entry.timestamp) > oneWeekAgo
    );

    const totalMinutes = recentHistory.reduce(
      (sum, entry) => sum + entry.duration, 
      0
    );

    const uniqueWorkouts = new Set(
      recentHistory.map(entry => entry.timestamp.split('T')[0])
    ).size;

    return {
      weeklyWorkoutsComplete: uniqueWorkouts >= userGoals.weeklyWorkouts,
      minutesComplete: totalMinutes >= userGoals.exerciseMinutes,
      weeklyWorkouts: uniqueWorkouts,
      totalMinutes
    };
  };

  const value = {
    exerciseHistory,
    difficultyLevels,
    userGoals,
    logExercise,
    getExerciseHistory,
    getRecommendedModifications,
    checkGoalProgress,
    setUserGoals,
    getDifficultyLevel: (exerciseId) => difficultyLevels[exerciseId] || { level: 'beginner', confidence: 0 }
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export default ProgressContext;