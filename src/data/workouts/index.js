import { basicWorkouts } from './basic.js';
import { premiumWorkouts } from './premium.js';
import { eliteWorkouts } from './elite.js';

// Export all workouts
export {
  basicWorkouts,
  premiumWorkouts,
  eliteWorkouts
};

// Get workouts by tier
export const getWorkoutsByTier = (tier) => {
  switch (tier) {
    case 'basic':
      return basicWorkouts;
    case 'premium':
      return [...basicWorkouts, ...premiumWorkouts];
    case 'elite':
      return [...basicWorkouts, ...premiumWorkouts, ...eliteWorkouts];
    default:
      return basicWorkouts;
  }
};

// Get all available workouts
export const getAllWorkouts = () => {
  return [...basicWorkouts, ...premiumWorkouts, ...eliteWorkouts];
};

// Get workouts by focus area
export const getWorkoutsByFocus = (focusArea) => {
  const allWorkouts = getAllWorkouts();
  return allWorkouts.filter(workout => 
    workout.focusAreas.includes(focusArea)
  );
};

// Helper to find a workout by ID
export const getWorkoutById = (id) => {
  return getAllWorkouts().find(workout => workout.id === id);
};
