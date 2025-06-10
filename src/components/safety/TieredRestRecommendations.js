// src/components/safety/TieredRestRecommendations.js
import React, { useState, useEffect } from 'react';
import { Clock, Battery, AlertTriangle, CheckCircle, Calendar, Lock } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import TierContentManager from '../subscription/TierContentManager';

export const TieredRestRecommendations = ({ exerciseId, intensity }) => {
  const { getLastWorkout, getFatigueLevel, getRestRecommendations } = useSafety();
  const { hasAccess } = useSubscription();
  const [readiness, setReadiness] = useState('ready');
  const [restDetails, setRestDetails] = useState(null);

  useEffect(() => {
    if (exerciseId) {
      const recommendations = getRestRecommendations(exerciseId);
      setReadiness(recommendations.readiness);
      setRestDetails(recommendations.details);
    }
  }, [exerciseId, getRestRecommendations]);

  // Basic Preview Content
  const BasicRestPreview = () => (
    <div>
      <p className="text-gray-600 mb-4">
        Proper rest between workouts is essential for recovery and progress.
      </p>
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="font-medium text-blue-800">Basic Rest Guidelines</p>
        <ul className="mt-2 space-y-1 text-sm text-blue-700">
          <li>• Allow 24-48 hours between workouts for the same muscle group</li>
          <li>• Stay hydrated and get adequate sleep</li>
        </ul>
      </div>
    </div>
  );

  // Premium Preview Content
  const PremiumRestPreview = () => (
    <div>
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
      </div>
      
      <div className="flex items-center gap-3">
        <Clock className="text-gray-400" />
        <div>
          <p className="font-medium">Recommended Rest</p>
          <p className="text-sm text-gray-600">
            {restDetails?.recommendedHours || 48} hours between sessions
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock className="text-blue-500" />
        Rest Recommendations
      </h2>

      {/* Basic Tier - Simple Rest Guidelines */}
      <TierContentManager
        requiredTier="basic"
        featureName="basic rest guidelines"
      >
        <div>
          <p className="text-gray-600 mb-4">
            Proper rest is essential for recovery and progress. Here are some general guidelines:
          </p>
          
          <div className="p-4 bg-blue-50 rounded-lg mb-4">
            <p className="font-medium text-blue-800">General Rest Guidelines</p>
            <ul className="mt-2 space-y-2 text-blue-700">
              <li className="flex items-start">
                <span className="inline-block w-4 text-center mr-2">•</span>
                <span>Allow 24-48 hours between workouts for the same muscle group</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-4 text-center mr-2">•</span>
                <span>Low intensity exercises require less rest than high intensity</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-4 text-center mr-2">•</span>
                <span>Stay hydrated and get adequate sleep for better recovery</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-yellow-700">
              <AlertTriangle />
              <p className="font-medium">Listen To Your Body</p>
            </div>
            <p className="text-yellow-700 text-sm">
              If you're feeling unusually tired or experiencing discomfort, it's okay to take an extra day of rest.
            </p>
          </div>
          
          {/* Premium Upgrade Promo */}
          <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-indigo-700">Premium Feature</p>
                <p className="text-sm text-indigo-600 mb-2">
                  Upgrade to Premium for personalized rest recommendations based on your workout history and fatigue levels.
                </p>
                <a 
                  href="/subscription/plans" 
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View upgrade options →
                </a>
              </div>
            </div>
          </div>
        </div>
      </TierContentManager>

      {/* Premium Tier - Personalized Rest Recommendations */}
      <TierContentManager
        requiredTier="premium"
        featureName="personalized rest recommendations"
        preview={true}
        previewContent={<BasicRestPreview />}
      >
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
                {restDetails?.recommendedHours || 48} hours between sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Battery className="text-gray-400" />
            <div>
              <p className="font-medium">Current Fatigue Level</p>
              <p className="text-sm text-gray-600">
                {restDetails?.fatigueLevel || 0}/10 - {
                  (restDetails?.fatigueLevel || 0) <= 3 ? 'Low'
                  : (restDetails?.fatigueLevel || 0) <= 6 ? 'Moderate'
                  : 'High'
                }
              </p>
            </div>
          </div>

          {restDetails?.lastWorkout && (
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" />
              <div>
                <p className="font-medium">Last Workout</p>
                <p className="text-sm text-gray-600">
                  {new Date(restDetails.lastWorkout).toLocaleDateString()} at{' '}
                  {new Date(restDetails.lastWorkout).toLocaleTimeString()}
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
        
        {/* Elite Upgrade Promo */}
        {!hasAccess('elite') && (
          <div className="mt-6 bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-purple-700">Elite Feature</p>
                <p className="text-sm text-purple-600 mb-2">
                  Upgrade to Elite for professional recovery guidance, advanced fatigue monitoring, and personalized workout scheduling.
                </p>
                <a 
                  href="/subscription/plans" 
                  className="text-sm font-medium text-purple-600 hover:text-purple-800"
                >
                  Upgrade to Elite →
                </a>
              </div>
            </div>
          </div>
        )}
      </TierContentManager>

      {/* Elite Tier - Advanced Rest & Recovery with Professional Guidance */}
      <TierContentManager
        requiredTier="elite"
        featureName="advanced recovery planning"
        preview={true}
        previewContent={<PremiumRestPreview />}
      >
        {/* Current Status - Elite Version */}
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

        {/* Elite Rest Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Clock className="text-gray-400" />
            <div>
              <p className="font-medium">Personalized Rest Recommendation</p>
              <p className="text-sm text-gray-600">
                {restDetails?.recommendedHours || 48} hours between sessions
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Customized based on your age, fitness level, and workout history
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Battery className="text-gray-400" />
            <div>
              <p className="font-medium">Current Fatigue Level</p>
              <p className="text-sm text-gray-600">
                {restDetails?.fatigueLevel || 0}/10 - {
                  (restDetails?.fatigueLevel || 0) <= 3 ? 'Low'
                  : (restDetails?.fatigueLevel || 0) <= 6 ? 'Moderate'
                  : 'High'
                }
              </p>
              <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                <div 
                  className={`h-2 rounded-full ${
                    (restDetails?.fatigueLevel || 0) <= 3 ? 'bg-green-500' 
                    : (restDetails?.fatigueLevel || 0) <= 6 ? 'bg-yellow-500' 
                    : 'bg-red-500'
                  }`} 
                  style={{ width: `${(restDetails?.fatigueLevel || 0) * 10}%` }}
                ></div>
              </div>
            </div>
          </div>

          {restDetails?.lastWorkout && (
            <div className="flex items-center gap-3">
              <Calendar className="text-gray-400" />
              <div>
                <p className="font-medium">Last Workout</p>
                <p className="text-sm text-gray-600">
                  {new Date(restDetails.lastWorkout).toLocaleDateString()} at{' '}
                  {new Date(restDetails.lastWorkout).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Professional Recovery Plan */}
        <div className="mt-6 border border-purple-200 rounded-lg overflow-hidden">
          <div className="bg-purple-100 p-3">
            <h3 className="font-medium text-purple-800">Professional Recovery Plan</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-700 mb-3">
              Based on your recent workouts and fatigue level, our professional trainers recommend:
            </p>
            
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="font-medium">Active Recovery</p>
                <p className="text-sm text-gray-600">
                  Light walking or gentle stretching to promote blood flow and recovery
                </p>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="font-medium">Nutrition Focus</p>
                <p className="text-sm text-gray-600">
                  Protein-rich meals to support muscle repair and recovery
                </p>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg">
                <p className="font-medium">Sleep Optimization</p>
                <p className="text-sm text-gray-600">
                  Aim for 8 hours of quality sleep to maximize recovery
                </p>
              </div>
            </div>
            
            <button className="mt-4 w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Schedule Recovery Consultation
            </button>
          </div>
        </div>

        {/* Weekly Recovery Calendar */}
        <div className="mt-6">
          <h3 className="font-medium mb-3">Weekly Recovery Calendar</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 text-center border-b border-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
                <div key={i} className="p-2 font-medium text-sm border-r last:border-r-0 border-gray-200">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 text-center">
              {['Rest', 'Strength', 'Active', 'Strength', 'Active', 'Strength', 'Rest'].map((type, i) => (
                <div key={i} className={`p-3 text-xs border-r last:border-r-0 border-gray-200 ${
                  type === 'Rest' 
                    ? 'bg-green-50 text-green-700' 
                    : type === 'Active' 
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-orange-50 text-orange-700'
                }`}>
                  {type}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Personalized schedule based on your recovery needs
          </p>
        </div>
      </TierContentManager>
    </div>
  );
};

export default TieredRestRecommendations;