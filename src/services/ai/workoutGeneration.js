import { getWorkoutRecommendation } from '../workoutRecommendation';

export const generateWorkout = async (userId) => {
  try {
    // Get workout recommendation based on user profile and history
    const recommendation = await getWorkoutRecommendation(userId);
    
    // Transform recommendation into workout format
    const workout = {
      id: Date.now().toString(),
      name: recommendation.name,
      exercises: recommendation.exercises.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        description: exercise.description,
        sets: exercise.sets,
        reps: exercise.reps,
        restSeconds: exercise.restSeconds
      })),
      focusAreas: recommendation.focusAreas,
      estimatedDuration: recommendation.estimatedDuration
    };

    return workout;
  } catch (error) {
    console.error('Error generating workout:', error);
    throw new Error('Failed to generate workout');
  }
}; 