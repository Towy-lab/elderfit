import basicWorkouts from './basic';
import premiumWorkouts from './premium';
import eliteWorkouts from './elite';

export const workoutLibrary = {
  basic: basicWorkouts,
  premium: premiumWorkouts,
  elite: eliteWorkouts
};

// Helper to get all workouts
export const getAllWorkouts = () => {
  return [...basicWorkouts, ...premiumWorkouts, ...eliteWorkouts];
};

// Helper to get workouts by tier
export const getWorkoutsByTier = (tier) => {
  switch(tier) {
    case 'basic':
      return basicWorkouts;
    case 'premium':
      return [...basicWorkouts, ...premiumWorkouts];
    case 'elite':
      return [...basicWorkouts, ...premiumWorkouts, ...eliteWorkouts];
    default:
      return [];
  }
};

// Helper to find a workout by ID
export const getWorkoutById = (id) => {
  return getAllWorkouts().find(workout => workout.id === id);
};
