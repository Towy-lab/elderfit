import React from 'react';
import { Clock, Battery, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyContext';

const RestRecommendations = ({ exerciseId, intensity }) => {
  const { getLastWorkout, getFatigueLevel } = useSafety();
  
  const lastWorkout = getLastWorkout(exerciseId);
  const fatigueLevel = getFatigueLevel();
  
  const getRestRecommendation = () => {
    const baseRest = {
      low: 24,
      moderate: 48,
      high: 72
    }[intensity || 'moderate'];

    // Adjust based on fatigue level
    const fatigueMultiplier = 1 + (fatigueLevel / 10);
    
    return Math.round(baseRest * fatigueMultiplier);
  };

  const getReadiness = () => {
    if (!lastWorkout) return 'ready';
    
    const hoursSinceLastWorkout = (Date.now() - new Date(lastWorkout).getTime()) / (1000 * 60 * 60);
    const recommendedRest = getRestRecommendation();
    
    if (hoursSinceLastWorkout < recommendedRest * 0.5) return 'notReady';
    if (hoursSinceLastWorkout < recommendedRest) return 'cautious';
    return 'ready';
  };

  const readiness = getReadiness();
  const recommendedHours = getRestRecommendation();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock className="text-blue-500" />
        Rest Recommendations
      </h2>

      {/* Current Status */}
      <div className={`p-4 rounded-lg mb-4 ${
        readiness === 'ready' 
          ? 'bg-green-50 text-green-700'
          : readiness === 'cautious'
          ? 'bg-yellow-50 text-yellow-700'
          : 'bg-red-50 text-red-700'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          {readiness === 'ready' ? (
            <CheckCircle />
          ) : (
            <AlertTriangle />
          )}
          <h3 className="font-medium">
            {readiness === 'ready'
              ? 'Ready for Exercise'
              : readiness === 'cautious'
              ? 'Proceed with Caution'
              : 'Rest Recommended'}
          </h3>
        </div>
        <p className="text-sm">
          {readiness === 'ready'
            ? "You've had adequate rest. Good to go!"
            : readiness === 'cautious'
            ? "You might need more rest. Listen to your body."
            : "It's too soon to repeat this exercise. Take more rest."}
        </p>
      </div>

      {/* Rest Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Clock className="text-gray-400" />
          <div>
            <p className="font-medium">Recommended Rest</p>
            <p className="text-sm text-gray-600">
              {recommendedHours} hours between sessions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Battery className="text-gray-400" />
          <div>
            <p className="font-medium">Current Fatigue Level</p>
            <p className="text-sm text-gray-600">
              {fatigueLevel}/10 - {
                fatigueLevel <= 3 ? 'Low'
                : fatigueLevel <= 6 ? 'Moderate'
                : 'High'
              }
            </p>
          </div>
        </div>

        {lastWorkout && (
          <div className="flex items-center gap-3">
            <Calendar className="text-gray-400" />
            <div>
              <p className="font-medium">Last Workout</p>
              <p className="text-sm text-gray-600">
                {new Date(lastWorkout).toLocaleDateString()} at{' '}
                {new Date(lastWorkout).toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">Recovery Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Stay hydrated and maintain good nutrition
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Get adequate sleep (7-9 hours)
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Consider light stretching or walking on rest days
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Monitor any unusual soreness or discomfort
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RestRecommendations;