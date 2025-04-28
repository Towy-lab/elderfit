// src/services/aiTraining.js

// Example of a simple recommendation system
export const generateWorkoutRecommendation = (userData, activityHistory) => {
  const { age, fitnessLevel, goals, limitations, equipment } = userData;
  
  // Base workout pool filtered by user's limitations
  let eligibleWorkouts = workoutLibrary.filter(workout => 
    !limitations.some(limitation => workout.contraindications.includes(limitation))
  );
  
  // Filter by available equipment
  eligibleWorkouts = eligibleWorkouts.filter(workout => 
    workout.requiredEquipment.every(item => equipment.includes(item))
  );
  
  // Adjust intensity based on fitness level and age
  const intensityFactor = calculateIntensityFactor(age, fitnessLevel);
  
  // Prioritize workouts aligned with user goals
  const scoredWorkouts = eligibleWorkouts.map(workout => ({
    ...workout,
    score: calculateWorkoutScore(workout, goals, activityHistory, intensityFactor)
  }));
  
  // Sort by score and select top recommendations
  return scoredWorkouts.sort((a, b) => b.score - a.score).slice(0, 5);
};

// Score workouts based on relevance to user goals and variety
const calculateWorkoutScore = (workout, goals, activityHistory, intensityFactor) => {
  let score = 0;
  
  // Goal alignment score
  goals.forEach(goal => {
    if (workout.targetGoals.includes(goal)) {
      score += 2;
    }
  });
  
  // Adjust for appropriate intensity
  const intensityDifference = Math.abs(workout.intensityLevel - intensityFactor);
  score -= intensityDifference;
  
  // Variety factor - reduce score for recently done workouts
  const recentlyDone = activityHistory
    .slice(0, 10)
    .some(activity => activity.workoutId === workout.id);
  
  if (recentlyDone) {
    score -= 3;
  }
  
  return score;
};
