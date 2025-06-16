export const adaptWorkoutDifficulty = (user, workout, lastPerformanceData) => {
  const { perceivedEffort, completionRate, painAreas } = lastPerformanceData;
  
  // Clone the workout to modify
  const adaptedWorkout = { ...workout };
  
  // Adjust based on perceived effort (1-10 scale)
  if (perceivedEffort < 3) {
    // Too easy - increase difficulty
    adaptedWorkout.exercises = adaptedWorkout.exercises.map(exercise => ({
      ...exercise,
      reps: Math.floor(exercise.reps * 1.15), // 15% more reps
      duration: Math.floor(exercise.duration * 1.1) // 10% longer duration
    }));
  } else if (perceivedEffort > 7) {
    // Too hard - decrease difficulty
    adaptedWorkout.exercises = adaptedWorkout.exercises.map(exercise => ({
      ...exercise,
      reps: Math.floor(exercise.reps * 0.85), // 15% fewer reps
      duration: Math.floor(exercise.duration * 0.9) // 10% shorter duration
    }));
  }
  
  // Modify exercises based on pain areas
  if (painAreas.length > 0) {
    // Replace exercises that target pain areas
    adaptedWorkout.exercises = adaptedWorkout.exercises.map(exercise => {
      const exerciseTargetsPainArea = exercise.targetAreas.some(area => 
        painAreas.includes(area)
      );
      
      if (exerciseTargetsPainArea) {
        // Substitute with a gentler alternative
        return findAlternativeExercise(exercise, painAreas);
      }
      
      return exercise;
    });
  }
  
  // Adjust rest periods based on completion rate
  if (completionRate < 0.8) {
    // If user completed less than 80%, increase rest periods
    adaptedWorkout.restBetweenExercises += 10; // Add 10 seconds
  }
  
  return adaptedWorkout;
};
