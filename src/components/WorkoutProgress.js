import React from 'react';
import { useProgress } from '../contexts/ProgressContext';
import { useSubscription } from '../contexts/SubscriptionContext';

const WorkoutProgress = () => {
  const { subscription } = useSubscription();
  const { 
    workouts = [], 
    streak = 0, 
    lastWorkout = null,
    totalWorkouts = 0,
    workoutHistory = [],
    isLoading = false, 
    error = null 
  } = useProgress() || {};

  // Calculate some additional stats
  const completedWorkouts = workoutHistory.length;
  const minutesExercised = workoutHistory.reduce((total, workout) => total + (workout.duration || 0), 0);
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  // Check if we have real progress data
  const hasRealProgress = (
    completedWorkouts > 0 && 
    workoutHistory.some(w => 
      w.completedAt && 
      w.exercisesCompleted?.length > 0 &&
      w.duration > 0
    )
  );

  // Check if streak is valid
  const hasValidStreak = streak > 0 && lastWorkout;

  // Get subscription-specific message
  const getSubscriptionMessage = () => {
    switch (subscription?.tier) {
      case 'basic':
        return 'Complete your first workout to start tracking your progress!';
      case 'premium':
        return 'Track your progress with detailed analytics and personalized insights.';
      case 'elite':
        return 'Access advanced progress tracking and AI-powered performance analysis.';
      default:
        return 'Complete your first workout to start tracking your progress!';
    }
  };

  // Get subscription-specific insights
  const getSubscriptionInsights = () => {
    if (!hasRealProgress) return null;

    switch (subscription?.tier) {
      case 'premium':
        return {
          title: 'Premium Insights',
          insights: [
            `You've completed ${completedWorkouts} workouts`,
            `Total exercise time: ${minutesExercised} minutes`,
            hasValidStreak ? `Current streak: ${streak} days` : 'Start a streak today!'
          ]
        };
      case 'elite':
        return {
          title: 'Elite Performance',
          insights: [
            `You've completed ${completedWorkouts} workouts`,
            `Total exercise time: ${minutesExercised} minutes`,
            hasValidStreak ? `Current streak: ${streak} days` : 'Start a streak today!',
            `Average workout duration: ${Math.round(minutesExercised / completedWorkouts)} minutes`
          ]
        };
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Your Fitness Journey</h2>
      
      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">
          {error}
        </div>
      ) : !hasRealProgress ? (
        <div className="text-center p-4">
          <p className="text-gray-500 mb-4">No workout data available yet.</p>
          <p className="text-sm text-gray-600">{getSubscriptionMessage()}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{hasValidStreak ? streak : 0}</p>
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

          {getSubscriptionInsights() && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{getSubscriptionInsights().title}</h3>
              <ul className="space-y-2">
                {getSubscriptionInsights().insights.map((insight, index) => (
                  <li key={index} className="text-gray-700">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkoutProgress;