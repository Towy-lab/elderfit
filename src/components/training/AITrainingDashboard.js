import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useWorkoutHistory } from '../../hooks/useWorkoutHistory';
import { getRecommendation } from '../../services/workoutRecommendation';
import WorkoutCard from '../workouts/WorkoutCard';
import { Loader } from 'lucide-react';

const AITrainingDashboard = () => {
  const { user } = useAuth();
  const { workoutHistory } = useWorkoutHistory();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateRecommendation();
  }, [user, workoutHistory]);

  const generateRecommendation = async () => {
    try {
      setLoading(true);
      setError(null);

      const recommendation = await getRecommendation(user.profile, workoutHistory);

      setRecommendation(recommendation);
    } catch (err) {
      setError('Unable to generate workout recommendation. Please try again.');
      console.error('Error generating recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        <p className="text-red-600">{error}</p>
        <button
          onClick={generateRecommendation}
          className="mt-2 text-red-600 hover:text-red-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Your AI-Powered Workout Plan</h2>
        
        {/* Workout Summary */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Workout Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Difficulty</p>
              <p className="text-lg">{recommendation?.difficulty || 'Beginner'}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Duration</p>
              <p className="text-lg">{recommendation?.estimatedDuration || '30'} minutes</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-medium">Focus Areas</p>
              <p className="text-lg">{recommendation?.focusAreas?.join(', ') || 'Full Body'}</p>
            </div>
          </div>
        </div>

        {/* Recommended Workout */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-2">Today's Recommended Workout</h3>
          {recommendation && (
            <WorkoutCard workout={recommendation} />
          )}
        </div>

        {/* Safety Recommendations */}
        {recommendation?.recommendations && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Safety Recommendations</h3>
            <ul className="space-y-2">
              {recommendation.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-blue-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Regenerate Button */}
        <div className="mt-6">
          <button
            onClick={generateRecommendation}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate New Recommendation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AITrainingDashboard; 