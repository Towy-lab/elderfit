import React from 'react';
import { useProgress } from '../contexts/ProgressContext';

const WorkoutProgress = () => {
  const { streak, workouts, lastWorkout, isLoading } = useProgress();
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Calculate stats
  const totalWorkouts = workouts.length;
  const lastWorkoutDate = formatDate(lastWorkout);
  
  if (isLoading) {
    return (
      <div className="h-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (totalWorkouts === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-lg font-medium text-gray-800 mb-2">No Workouts Yet</h3>
        <p className="text-gray-600 mb-4">Complete your first workout to start tracking your progress!</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
          Start a Workout
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-700 mb-1">{totalWorkouts}</div>
          <div className="text-sm text-gray-600">Workouts Completed</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-700 mb-1">{streak}</div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-medium text-blue-700 mb-1">{lastWorkoutDate}</div>
          <div className="text-sm text-gray-600">Last Workout</div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-medium mb-2">Recent Activity</h4>
        {workouts.length > 0 ? (
          <div className="space-y-2">
            {workouts.slice(-3).reverse().map((workout, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">Completed workout: Workout #{workout.id}</span>
                <span className="text-sm text-gray-500">{formatDate(workout.completedAt)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No recent activity to display.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutProgress;