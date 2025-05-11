import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { useNavigate } from 'react-router-dom';
import { useWorkoutHistory } from '../../hooks/useWorkoutHistory';
import { getRecommendation } from '../../services/workoutRecommendation';
import ExerciseModifications from '../ExerciseModifications';
import WorkoutCard from '../workouts/WorkoutCard';
import { Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const AITrainingDashboard = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const navigate = useNavigate();
  const { workoutHistory, loading: historyLoading } = useWorkoutHistory();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user has Elite access
    if (!subscription || subscription.tier !== 'elite') {
      navigate('/subscription/plans');
      return;
    }

    // Only generate recommendation if we have user data and workout history is loaded
    if (user && !historyLoading) {
      generateRecommendation();
    }
  }, [user, workoutHistory, subscription, navigate, historyLoading]);

  const generateRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required data
      if (!user) {
        throw new Error('Please log in to access AI training features');
      }

      if (!user.profile) {
        throw new Error('Please complete your profile to get personalized recommendations');
      }

      if (!user.profile.fitnessLevel) {
        throw new Error('Please set your fitness level in your profile');
      }

      if (!user.profile.goals || user.profile.goals.length === 0) {
        throw new Error('Please set your fitness goals in your profile');
      }

      const recommendation = await getRecommendation(user.profile, workoutHistory || []);
      
      if (!recommendation) {
        throw new Error('Unable to generate recommendations. Please try again later');
      }

      setRecommendation(recommendation);
    } catch (err) {
      const errorMessage = err.message || 'Unable to generate workout recommendation. Please try again.';
      setError(errorMessage);
      console.error('Error generating recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || historyLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-gray-600">Analyzing your profile and generating recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
        {error.includes('profile') ? (
          <Link 
            to="/profile" 
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors inline-block"
          >
            Go to Profile
          </Link>
        ) : (
          <button
            onClick={generateRecommendation}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-purple-50 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">AI-Powered Training</h1>
          <p className="text-purple-700">
            Get personalized workout recommendations and real-time form analysis powered by AI.
          </p>
        </div>

        <div className="space-y-6">
          {recommendation && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{recommendation.name}</h2>
                  <p className="text-gray-600 mt-1">
                    Estimated duration: {Math.round(recommendation.estimatedDuration)} minutes
                  </p>
                </div>
                <button
                  onClick={generateRecommendation}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Generate New</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.focusAreas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Exercises</h3>
                  <div className="space-y-4">
                    {recommendation.exercises.map((exercise, index) => (
                      <div
                        key={exercise.id}
                        className="bg-gray-50 rounded-lg p-4"
                      >
                        <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                        <p className="text-gray-600 text-sm mt-1">{exercise.description}</p>
                        <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Sets:</span>
                            <span className="ml-1 text-gray-900">{exercise.sets}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Reps:</span>
                            <span className="ml-1 text-gray-900">{exercise.reps}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Rest:</span>
                            <span className="ml-1 text-gray-900">{exercise.restSeconds}s</span>
                          </div>
                        </div>
                        <ExerciseModifications
                          modifications={exercise.modifications}
                          limitations={user.profile.healthConditions}
                          equipment={exercise.equipment}
                          exercise={exercise}
                          className="mt-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Safety Recommendations</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {recommendation.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITrainingDashboard; 