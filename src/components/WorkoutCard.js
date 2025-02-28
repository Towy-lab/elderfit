import React from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

// Create a LoadingCard component to fix the undefined error
const LoadingCard = () => (
  <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-full"></div>
  </div>
);

const WorkoutCard = ({ workout, isLoading = false, exercises = [] }) => {
  // Fix the conditional hook call issue by moving the hook to component level
  // We'll use a simple check for exercises instead of calling a hook conditionally
  const hasExercises = exercises && exercises.length > 0;

  if (isLoading) {
    return <LoadingCard />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5">
        <h3 className="font-semibold text-lg">{workout.title}</h3>
        <div className="flex items-center mt-1 text-sm text-gray-600">
          <span>{workout.duration}</span>
          <span className="mx-2">•</span>
          <span>{workout.level}</span>
        </div>
        
        {hasExercises && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-1">Exercises:</p>
            <ul className="text-sm text-gray-600">
              {exercises.slice(0, 3).map((exercise, index) => (
                <li key={index} className="truncate">• {exercise.name}</li>
              ))}
              {exercises.length > 3 && (
                <li className="text-indigo-600">+ {exercises.length - 3} more</li>
              )}
            </ul>
          </div>
        )}
        
        <Link
          to={`/workouts/${workout.id}`}
          className="mt-4 block w-full text-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition duration-200"
        >
          View Workout
        </Link>
      </div>
    </div>
  );
};

export default WorkoutCard;