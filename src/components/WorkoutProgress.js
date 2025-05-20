import React from 'react';
import { useProgress } from '../contexts/ProgressContext';

const WorkoutProgress = () => {
  // Get all the values from your ProgressContext
  const { workouts = [], streak = 0, lastWorkout = null, isLoading = false } = useProgress() || {};

  // Calculate some additional stats
  const completedWorkouts = workouts.length;
  const minutesExercised = workouts.reduce((total, workout) => total + (workout.duration || 0), 0);
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Fitness Journey</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{streak}</p>
              <p className="text-sm text-gray-600">Day Streak</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{completedWorkouts}</p>
              <p className="text-sm text-gray-600">Workouts</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">{minutesExercised}</p>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">{Math.round(minutesExercised * 5)}</p>
              <p className="text-sm text-gray-600">Points</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Recent Activity</h3>
            
            {workouts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No workouts completed yet. Start your first workout today!
              </p>
            ) : (
              <div className="space-y-2">
                {workouts.slice(0, 3).map((workout, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{workout.id || "Workout"}</p>
                      <p className="text-xs text-gray-500">{formatDate(workout.completedAt)}</p>
                    </div>
                    <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">
                      {workout.duration || "?"} min
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutProgress;