import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import FormGuidance from '../safety/FormGuidance';
import { CameraSetupGuide } from '../safety/CameraSetupGuide';
import { generateWorkout } from '../../services/ai/workoutGeneration';
import { AlertCircle, Play, Info } from 'lucide-react';

const AITrainingDashboard = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [workout, setWorkout] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateWorkout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const generatedWorkout = await generateWorkout(user.id);
      setWorkout(generatedWorkout);
    } catch (err) {
      setError('Failed to generate workout. Please try again.');
      console.error('Error generating workout:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExercise = (exercise) => {
    setSelectedExercise(exercise);
  };

  if (!subscription?.tier || subscription.tier === 'free') {
    return (
      <div className="text-center p-8">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Upgrade Required</h2>
        <p className="text-gray-600">
          Upgrade to Premium to access AI-powered workout generation and form analysis.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AI Training Dashboard</h1>

      {/* Generate Workout Section */}
      {!workout && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Generate Your Workout</h2>
          <p className="text-gray-600 mb-6">
            Click the button below to generate a personalized workout based on your fitness level and goals.
          </p>
          <button
            onClick={handleGenerateWorkout}
            disabled={isLoading}
            className={`${
              isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
          >
            {isLoading ? 'Generating...' : 'Generate Workout'}
          </button>
          {error && (
            <p className="text-red-500 mt-4">{error}</p>
          )}
        </div>
      )}

      {/* Workout Display */}
      {workout && !selectedExercise && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Generated Workout</h2>
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">{exercise.name}</h3>
                <p className="text-gray-600 mb-4">{exercise.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {exercise.sets} sets × {exercise.reps} reps
                  </div>
                  <button
                    onClick={() => handleStartExercise(exercise)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Exercise
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Analysis Section */}
      {selectedExercise && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Form Analysis</h2>
            <button
              onClick={() => setSelectedExercise(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Back to Workout
            </button>
          </div>
          <FormGuidance exercise={selectedExercise} />
        </div>
      )}

      {/* Setup Guide Modal */}
      {showSetupGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowSetupGuide(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <AlertCircle className="h-6 w-6" />
            </button>
            <div className="p-6">
              <CameraSetupGuide />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITrainingDashboard; 