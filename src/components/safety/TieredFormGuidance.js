// src/components/safety/TieredFormGuidance.js
import React, { useState } from 'react';
import { AlertCircle, Check, X, Eye, Shield, Lock } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import TierContentManager from '../subscription/TierContentManager';

export const TieredFormGuidance = ({ exercise }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { logFormCheck } = useSafety();
  const { hasTierAccess } = useSubscription();

  const formChecklist = [
    {
      title: 'Starting Position',
      description: exercise.startingPosition,
      checkpoints: [
        'Proper body alignment',
        'Stable base of support',
        'Comfortable and balanced'
      ]
    },
    {
      title: 'Movement Pattern',
      description: exercise.movement,
      checkpoints: [
        'Controlled movement speed',
        'Full range of motion',
        'Smooth execution'
      ]
    },
    {
      title: 'Breathing',
      description: 'Maintain steady breathing throughout the exercise',
      checkpoints: [
        'Breathe steadily',
        'No breath holding',
        'Synchronized with movement'
      ]
    }
  ];

  const commonMistakes = [
    'Rushing through movements',
    'Poor posture alignment',
    'Overextending joints',
    'Using momentum instead of control'
  ];

  const handleStepComplete = (passed) => {
    logFormCheck(exercise.id, {
      step: currentStep,
      passed,
      timestamp: new Date().toISOString()
    });

    if (currentStep < formChecklist.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Basic Preview Content
  const BasicGuidancePreview = () => (
    <div>
      <h3 className="font-medium text-lg mb-2">
        Form Guidance
      </h3>
      <p className="text-gray-600 mb-4">
        Proper form is essential for safe and effective exercises.
      </p>
      <div className="space-y-2 mb-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="font-medium">Starting Position</p>
          <p className="text-sm text-gray-600">
            {exercise.startingPosition?.substring(0, 60)}...
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Eye className="text-blue-500" />
        Form Guidance
      </h2>

      {/* Basic Tier - Simple guidance */}
      <TierContentManager
        requiredTier="basic"
        featureName="basic form guidance"
      >
        <div>
          <h3 className="font-medium text-lg mb-2">
            Safe Starting Position
          </h3>
          <p className="text-gray-600 mb-4">
            {exercise.startingPosition}
          </p>

          <h3 className="font-medium text-lg mb-2 mt-4">
            Basic Movement
          </h3>
          <p className="text-gray-600 mb-4">
            {exercise.movement}
          </p>

          {/* Safety Tips - Basic Tier */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2 text-blue-700">
              <AlertCircle />
              <h3 className="font-medium">Safety Reminders</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-600">
              <li className="flex items-center gap-2">
                • Stop if you feel any sharp pain
              </li>
              <li className="flex items-center gap-2">
                • Maintain proper breathing throughout
              </li>
              <li className="flex items-center gap-2">
                • Stay within your comfortable range
              </li>
            </ul>
          </div>

          {/* Premium Upgrade Prompt */}
          <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-indigo-700">Premium Feature</p>
                <p className="text-sm text-indigo-600 mb-2">
                  Upgrade to Premium or Elite for detailed form guidance, visual cues, and personalized feedback.
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

      {/* Premium Tier - Full form guidance */}
      <TierContentManager
        requiredTier="premium"
        featureName="advanced form guidance"
        preview={true}
        previewContent={<BasicGuidancePreview />}
      >
        {/* Progress Steps */}
        <div className="flex justify-between mb-6">
          {formChecklist.map((step, index) => (
            <div 
              key={index}
              className={`flex-1 h-2 rounded-full mx-1 ${
                index < currentStep
                  ? 'bg-green-500'
                  : index === currentStep
                  ? 'bg-blue-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Current Step */}
        <div className="mb-6">
          <h3 className="font-medium text-lg mb-2">
            {formChecklist[currentStep].title}
          </h3>
          <p className="text-gray-600 mb-4">
            {formChecklist[currentStep].description}
          </p>

          {/* Checkpoints */}
          <div className="space-y-3">
            {formChecklist[currentStep].checkpoints.map((checkpoint, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <Check className="text-green-500" />
                <span>{checkpoint}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Check Buttons */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleStepComplete(true)}
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Check size={20} />
            Correct Form
          </button>
          <button
            onClick={() => handleStepComplete(false)}
            className="flex-1 flex items-center justify-center gap-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <X size={20} />
            Need Adjustment
          </button>
        </div>

        {/* Common Mistakes */}
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="text-orange-500" />
            <h3 className="font-medium">Watch Out For</h3>
          </div>
          <div className="space-y-2">
            {commonMistakes.map((mistake, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg"
              >
                <AlertCircle className="text-orange-500 flex-shrink-0 mt-1" />
                <p className="text-orange-700">{mistake}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-blue-700">
            <AlertCircle />
            <h3 className="font-medium">Safety Reminders</h3>
          </div>
          <ul className="space-y-2 text-sm text-blue-600">
            <li className="flex items-center gap-2">
              • Stop if you feel any sharp pain
            </li>
            <li className="flex items-center gap-2">
              • Maintain proper breathing throughout
            </li>
            <li className="flex items-center gap-2">
              • Stay within your comfortable range
            </li>
          </ul>
        </div>

        {/* Elite Tier Promo */}
        {!hasTierAccess('elite') && (
          <div className="mt-6 bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-purple-700">Elite Feature</p>
                <p className="text-sm text-purple-600 mb-2">
                  Upgrade to Elite for personalized form adjustments from certified trainers and video analysis.
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
    </div>
  );
};