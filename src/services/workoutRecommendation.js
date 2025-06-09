import { calculateBMI, getAgeGroup } from '../utils/healthCalculations';
import basicWorkouts from '../data/workouts/basic';
import premiumWorkouts from '../data/workouts/premium';
import eliteWorkouts from '../data/workouts/elite';

// Constants
const DIFFICULTY_LEVELS = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3
};

const INTENSITY_MULTIPLIERS = {
  LOW: 0.8,
  MEDIUM: 1,
  HIGH: 1.2
};

// Exercise database
const EXERCISES = {
  strength: [
    {
      id: 'chair-squats',
      name: 'Chair Squats',
      description: 'Sit and stand from a chair to build leg strength',
      difficulty: 1,
      sets: 3,
      reps: 10,
      restSeconds: 60,
      focusAreas: ['Legs', 'Core'],
      modifications: ['Use armrests', 'Add cushion']
    },
    {
      id: 'wall-pushups',
      name: 'Wall Push-ups',
      description: 'Push-ups against a wall to build upper body strength',
      difficulty: 1,
      sets: 3,
      reps: 12,
      restSeconds: 45,
      focusAreas: ['Chest', 'Arms'],
      modifications: ['Stand closer to wall', 'Use counter']
    },
    {
      id: 'arm-circles',
      name: 'Arm Circles',
      description: 'Circular motions with arms to improve shoulder mobility',
      difficulty: 1,
      sets: 2,
      reps: 15,
      restSeconds: 30,
      focusAreas: ['Shoulders', 'Arms'],
      modifications: ['Smaller circles', 'Seated position']
    }
  ],
  balance: [
    {
      id: 'heel-toe-walk',
      name: 'Heel-to-Toe Walk',
      description: 'Walk in a straight line with heel touching toe',
      difficulty: 2,
      sets: 2,
      reps: 10,
      restSeconds: 45,
      focusAreas: ['Balance', 'Coordination'],
      modifications: ['Use wall support', 'Wider stance']
    },
    {
      id: 'single-leg-stand',
      name: 'Single Leg Stand',
      description: 'Stand on one leg while holding onto support',
      difficulty: 2,
      sets: 3,
      reps: 30,
      restSeconds: 30,
      focusAreas: ['Balance', 'Core'],
      modifications: ['Use chair support', 'Shorter duration']
    }
  ],
  flexibility: [
    {
      id: 'shoulder-stretch',
      name: 'Shoulder Stretch',
      description: 'Cross arm across chest to stretch shoulder',
      difficulty: 1,
      sets: 2,
      reps: 30,
      restSeconds: 30,
      focusAreas: ['Shoulders', 'Upper Back'],
      modifications: ['Gentle stretch', 'Seated position']
    },
    {
      id: 'ankle-rotations',
      name: 'Ankle Rotations',
      description: 'Rotate ankles to improve mobility',
      difficulty: 1,
      sets: 2,
      reps: 20,
      restSeconds: 30,
      focusAreas: ['Ankles', 'Lower Legs'],
      modifications: ['Seated position', 'Smaller range']
    }
  ]
};

const analyzeUserProfile = (profile) => {
  const {
    age,
    height,
    weight,
    fitnessLevel,
    healthConditions = [],
    goals = [],
    equipment = []
  } = profile;

  const bmi = calculateBMI(height, weight);
  const ageGroup = getAgeGroup(age);

  let baseDifficulty = DIFFICULTY_LEVELS.BEGINNER;
  if (fitnessLevel === 'intermediate') baseDifficulty = DIFFICULTY_LEVELS.INTERMEDIATE;
  if (fitnessLevel === 'advanced') baseDifficulty = DIFFICULTY_LEVELS.ADVANCED;

  const hasLimitations = healthConditions.length > 0;
  if (hasLimitations) {
    baseDifficulty = Math.max(DIFFICULTY_LEVELS.BEGINNER, baseDifficulty - 1);
  }

  return {
    bmi,
    ageGroup,
    baseDifficulty,
    healthConditions,
    goals,
    availableEquipment: equipment,
    hasLimitations
  };
};

const analyzeWorkoutHistory = (history) => {
  if (!history || history.length === 0) {
    return {
      completionRate: 0,
      averageIntensity: INTENSITY_MULTIPLIERS.LOW,
      preferredExercises: [],
      challengingExercises: []
    };
  }

  const completedWorkouts = history.filter(workout => workout.completed);
  const completionRate = completedWorkouts.length / history.length;

  const exerciseStats = history.reduce((stats, workout) => {
    workout.exercises.forEach(exercise => {
      if (!stats[exercise.id]) {
        stats[exercise.id] = {
          completions: 0,
          difficulties: [],
          ratings: []
        };
      }
      
      if (exercise.completed) {
        stats[exercise.id].completions++;
        stats[exercise.id].difficulties.push(exercise.difficultyRating);
        stats[exercise.id].ratings.push(exercise.userRating);
      }
    });
    return stats;
  }, {});

  const preferredExercises = Object.entries(exerciseStats)
    .filter(([_, stats]) => {
      const avgRating = stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length;
      return avgRating >= 4;
    })
    .map(([id]) => id);

  const challengingExercises = Object.entries(exerciseStats)
    .filter(([_, stats]) => {
      const avgDifficulty = stats.difficulties.reduce((a, b) => a + b, 0) / stats.difficulties.length;
      return avgDifficulty >= 4;
    })
    .map(([id]) => id);

  return {
    completionRate,
    averageIntensity: determineIntensityMultiplier(completionRate),
    preferredExercises,
    challengingExercises
  };
};

const determineIntensityMultiplier = (completionRate) => {
  if (completionRate < 0.6) return INTENSITY_MULTIPLIERS.LOW;
  if (completionRate > 0.8) return INTENSITY_MULTIPLIERS.HIGH;
  return INTENSITY_MULTIPLIERS.MEDIUM;
};

const selectBaseWorkout = (userFactors) => {
  const { goals, healthConditions, baseDifficulty } = userFactors;
  
  // Select exercises based on goals and difficulty
  const selectedExercises = [];
  
  // Always include at least one strength exercise
  const strengthExercises = EXERCISES.strength.filter(ex => ex.difficulty <= baseDifficulty);
  selectedExercises.push(strengthExercises[Math.floor(Math.random() * strengthExercises.length)]);
  
  // Add balance exercises if balance is a goal or if user has balance-related conditions
  if (goals.includes('balance') || healthConditions.some(condition => 
    ['vertigo', 'dizziness', 'balance issues'].includes(condition.toLowerCase()))) {
    const balanceExercises = EXERCISES.balance.filter(ex => ex.difficulty <= baseDifficulty);
    selectedExercises.push(balanceExercises[Math.floor(Math.random() * balanceExercises.length)]);
  }
  
  // Add flexibility exercises
  const flexibilityExercises = EXERCISES.flexibility.filter(ex => ex.difficulty <= baseDifficulty);
  selectedExercises.push(flexibilityExercises[Math.floor(Math.random() * flexibilityExercises.length)]);
  
  return {
    id: `workout-${Date.now()}`,
    name: 'Personalized Workout',
    exercises: selectedExercises,
    focusAreas: [...new Set(selectedExercises.flatMap(ex => ex.focusAreas))]
  };
};

const adjustExercisesForUser = (exercises, userFactors, historyFactors) => {
  return exercises.map(exercise => ({
    ...exercise,
    reps: Math.round(exercise.reps * userFactors.baseDifficulty)
  }));
};

const adjustWorkoutIntensity = (exercises, intensityMultiplier) => {
  return exercises.map(exercise => ({
    ...exercise,
    reps: Math.round(exercise.reps * intensityMultiplier)
  }));
};

const calculateWorkoutDuration = (exercises) => {
  return exercises.reduce((total, exercise) => {
    return total + (exercise.sets * exercise.reps * 3) + (exercise.restSeconds * (exercise.sets - 1));
  }, 0) / 60;
};

const generateSafetyRecommendations = (userFactors) => {
  const recommendations = [
    'Remember to warm up before starting',
    'Stay hydrated throughout your workout',
    'Stop if you experience any sharp pain'
  ];

  if (userFactors.hasLimitations) {
    recommendations.push('Modify exercises as needed for your comfort');
  }

  return recommendations;
};

const createPersonalizedWorkout = (userFactors, historyFactors) => {
  try {
    // Select base workout
    const baseWorkout = selectBaseWorkout(userFactors);
    
    // Adjust exercises for user
    const adjustedExercises = adjustExercisesForUser(
      baseWorkout.exercises,
      userFactors,
      historyFactors
    );
    
    // Adjust workout intensity
    const finalExercises = adjustWorkoutIntensity(
      adjustedExercises,
      historyFactors.averageIntensity
    );
    
    // Calculate total duration
    const duration = calculateWorkoutDuration(finalExercises);
    
    return {
      name: `Personalized ${baseWorkout.type} Workout`,
      type: baseWorkout.type,
      exercises: finalExercises,
      estimatedDuration: duration,
      focusAreas: baseWorkout.focusAreas
    };
  } catch (error) {
    console.error('Error creating personalized workout:', error);
    throw error;
  }
};

export const getRecommendation = async (userProfile, workoutHistory) => {
  try {
    // Validate input data
    if (!userProfile) {
      throw new Error('User profile is required');
    }

    // Simple profile analysis
    const userFactors = {
      fitnessLevel: userProfile.fitnessLevel || 'beginner',
      goals: userProfile.goals || [],
      healthConditions: userProfile.healthConditions || [],
      equipment: userProfile.equipment || [],
      hasLimitations: (userProfile.healthConditions || []).length > 0
    };

    // Create a simple workout based on user's fitness level and goals
    const workout = {
      name: 'Personalized Workout',
      type: 'strength',
      exercises: [],
      estimatedDuration: 30,
      focusAreas: []
    };

    // Add exercises based on fitness level
    const difficulty = userFactors.fitnessLevel === 'beginner' ? 1 : 
                      userFactors.fitnessLevel === 'intermediate' ? 2 : 3;

    // Select exercises based on goals
    const selectedExercises = [];
    
    // Always include at least one strength exercise
    const strengthExercises = EXERCISES.strength.filter(ex => ex.difficulty <= difficulty);
    if (strengthExercises.length > 0) {
      selectedExercises.push(strengthExercises[0]);
    }

    // Add balance exercises if balance is a goal
    if (userFactors.goals.includes('Better Balance')) {
      const balanceExercises = EXERCISES.balance.filter(ex => ex.difficulty <= difficulty);
      if (balanceExercises.length > 0) {
        selectedExercises.push(balanceExercises[0]);
      }
    }

    // Add flexibility exercises
    const flexibilityExercises = EXERCISES.flexibility.filter(ex => ex.difficulty <= difficulty);
    if (flexibilityExercises.length > 0) {
      selectedExercises.push(flexibilityExercises[0]);
    }

    // Update workout with selected exercises
    workout.exercises = selectedExercises;
    workout.focusAreas = [...new Set(selectedExercises.flatMap(ex => ex.focusAreas))];

    return workout;
  } catch (error) {
    console.error('Error generating workout recommendation:', error);
    throw error;
  }
};

export const getWorkoutRecommendation = async (userId) => {
  try {
    // For now, return a basic workout recommendation
    const basicWorkout = basicWorkouts[0];
    
    return {
      id: basicWorkout.id,
      name: basicWorkout.name,
      exercises: basicWorkout.exercises,
      focusAreas: basicWorkout.focusAreas,
      estimatedDuration: basicWorkout.estimatedDuration
    };
  } catch (error) {
    console.error('Error getting workout recommendation:', error);
    throw new Error('Failed to get workout recommendation');
  }
}; 