import { calculateBMI, getAgeGroup } from '../utils/healthCalculations';

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

class WorkoutAI {
  static analyzeUserProfile(profile) {
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
  }

  static analyzeWorkoutHistory(history) {
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
      averageIntensity: this.determineIntensityMultiplier(completionRate),
      preferredExercises,
      challengingExercises
    };
  }

  static determineIntensityMultiplier(completionRate) {
    if (completionRate < 0.6) return INTENSITY_MULTIPLIERS.LOW;
    if (completionRate > 0.8) return INTENSITY_MULTIPLIERS.HIGH;
    return INTENSITY_MULTIPLIERS.MEDIUM;
  }

  static selectBaseWorkout(userFactors) {
    return {
      id: 'mock-workout-1',
      name: 'Personalized Workout',
      exercises: [
        {
          id: 'ex1',
          name: 'Chair Squats',
          sets: 3,
          reps: 10,
          restSeconds: 60
        }
      ],
      focusAreas: ['Strength', 'Balance']
    };
  }

  static adjustExercisesForUser(exercises, userFactors, historyFactors) {
    return exercises.map(exercise => ({
      ...exercise,
      reps: Math.round(exercise.reps * userFactors.baseDifficulty)
    }));
  }

  static adjustWorkoutIntensity(exercises, intensityMultiplier) {
    return exercises.map(exercise => ({
      ...exercise,
      reps: Math.round(exercise.reps * intensityMultiplier)
    }));
  }

  static calculateWorkoutDuration(exercises) {
    return exercises.reduce((total, exercise) => {
      return total + (exercise.sets * exercise.reps * 3) + (exercise.restSeconds * (exercise.sets - 1));
    }, 0) / 60;
  }

  static generateSafetyRecommendations(userFactors) {
    const recommendations = [
      'Remember to warm up before starting',
      'Stay hydrated throughout your workout',
      'Stop if you experience any sharp pain'
    ];

    if (userFactors.hasLimitations) {
      recommendations.push('Modify exercises as needed for your comfort');
    }

    return recommendations;
  }

  static createPersonalizedWorkout(userFactors, historyFactors) {
    const baseWorkout = this.selectBaseWorkout(userFactors);
    
    const adjustedExercises = this.adjustExercisesForUser(
      baseWorkout.exercises,
      userFactors,
      historyFactors
    );

    const finalWorkout = this.adjustWorkoutIntensity(
      adjustedExercises,
      historyFactors.averageIntensity
    );

    return {
      ...baseWorkout,
      exercises: finalWorkout,
      difficulty: userFactors.baseDifficulty,
      estimatedDuration: this.calculateWorkoutDuration(finalWorkout),
      recommendations: this.generateSafetyRecommendations(userFactors)
    };
  }
}

export const generateWorkoutRecommendation = async (userProfile, workoutHistory) => {
  try {
    const userFactors = WorkoutAI.analyzeUserProfile(userProfile);
    const historyFactors = WorkoutAI.analyzeWorkoutHistory(workoutHistory);
    const recommendation = WorkoutAI.createPersonalizedWorkout(userFactors, historyFactors);
    return recommendation;
  } catch (error) {
    console.error('Error generating workout recommendation:', error);
    throw error;
  }
}; 