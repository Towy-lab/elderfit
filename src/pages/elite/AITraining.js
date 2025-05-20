import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useExercises } from '../../contexts/ExerciseContext';
import { generateWorkoutRecommendation } from '../../services/aiTraining';
import { adaptWorkoutDifficulty } from '../../services/adaptiveTraining';
import WorkoutCard from '../../components/workouts/WorkoutCard';
import { Brain, RefreshCw, ThumbsUp, ThumbsDown, Target, Calendar } from 'lucide-react';

const AITraining = () => {
  const { user } = useAuth();
  const { workoutHistory, addWorkoutToHistory } = useExercises();
  
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  useEffect(() => {
    const generateRecommendations = async () => {
      setIsLoading(true);
      
      try {
        // Get user profile and activity data
        const userData = user.profile;
        const activityData = workoutHistory.slice(0, 20); // Last 20 workouts
        
        // Generate personalized recommendations
        const workouts = generateWorkoutRecommendation(userData, activityData);
        
        // Adapt difficulty based on recent performance
        const lastWorkout = activityData[0];
        if (lastWorkout) {
          const adaptedWorkouts = workouts.map(workout => 
            adaptWorkoutDifficulty(user, workout, lastWorkout.performanceData)
          );
          setRecommendations(adaptedWorkouts);
        } else {
          setRecommendations(workouts);
        }
      } catch (error) {
        console.error('Error generating recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    generateRecommendations();
  }, [user, workoutHistory]);
  
  const regenerateRecommendations = () => {
    setFeedbackSubmitted(false);
    setRecommendations([]);
    setIsLoading(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Re-run the recommendation algorithm with slight variations
      const newRecommendations = [...recommendations]
        .sort(() => Math.random() - 0.5)
        .map(workout => ({
          ...workout,
          aiGenerated: true,
          generatedAt: new Date().toISOString()
        }));
      
      setRecommendations(newRecommendations);
      setIsLoading(false);
    }, 1500);
  };
  
  const provideFeedback = (workoutId, isPositive) => {
    // In a real implementation, this would be sent to the backend
    // to improve the recommendation algorithm
    console.log(`Feedback for workout ${workoutId}: ${isPositive ? 'positive' : 'negative'}`);
    setFeedbackSubmitted(true);
    
    // Optimistic UI update - move approved workout to top
    if (isPositive) {
      const approvedWorkout = recommendations.find(w => w.id === workoutId);
      const otherWorkouts = recommendations.filter(w => w.id !== workoutId);
      setRecommendations([approvedWorkout, ...otherWorkouts]);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200 mb-8">
        <div className="flex items-center mb-4">
          <Brain className="text-indigo-600 mr-3" size={28} />
          <h1 className="text-3xl font-bold text-indigo-800">AI-Powered Training</h1>
        </div>
        <p className="text-indigo-700 mb-4">
          Your personalized workout recommendations, powered by our advanced AI system. These recommendations are tailored to your fitness level, goals, and previous activity.
        </p>
        
        <button 
          onClick={regenerateRecommendations}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          <RefreshCw size={18} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Regenerate Recommendations
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Our AI is analyzing your profile and workout history...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {recommendations.map((workout, index) => (
            <div key={workout.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="bg-indigo-100 py-3 px-4 flex justify-between items-center">
                <div className="flex items-center">
                  {index === 0 && !feedbackSubmitted && (
                    <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full mr-2">
                      Top Pick
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-indigo-800">{workout.name}</h3>
                </div>
                
                {!feedbackSubmitted && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => provideFeedback(workout.id, true)}
                      className="p-1 hover:bg-green-100 rounded"
                      title="This looks good"
                    >
                      <ThumbsUp size={20} className="text-green-600" />
                    </button>
                    <button 
                      onClick={() => provideFeedback(workout.id, false)}
                      className="p-1 hover:bg-red-100 rounded"
                      title="Show me different options"
                    >
                      <ThumbsDown size={20} className="text-red-600" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="flex items-center text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                    <Target size={12} className="mr-1" />
                    {workout.targetGoals.join(', ')}
                  </span>
                  <span className="flex items-center text-xs px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full">
                    <Calendar size={12} className="mr-1" />
                    {workout.duration} minutes
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">{workout.description}</p>
                
                <div className="bg-indigo-50 p-3 rounded mb-4">
                  <p className="text-sm text-indigo-700">
                    <strong>AI Insight:</strong> This workout was recommended because it aligns with your {workout.targetGoals[0]} goal and matches your current fitness level. It's been adjusted based on your recent performance data.
                  </p>
                </div>
                
                <div className="mt-4">
                  <a 
                    href={`/elite/workout/${workout.id}`} 
                    className="block w-full text-center py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Start Workout
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AITraining;
