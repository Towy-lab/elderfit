// src/components/safety/TieredFormGuidance.js
import React, { useState } from 'react';
import { AlertCircle, Check, X, Eye, Shield, Lock } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import TierContentManager from '../subscription/TierContentManager';
import FormGuidance from './FormGuidance';

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

  if (!hasTierAccess('elite')) {
    return (
      <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lock className="text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <p className="font-medium text-purple-700">Elite Feature</p>
            <p className="text-sm text-purple-600 mb-2">
              Upgrade to Elite for AI-powered form analysis, real-time feedback, and personalized safety monitoring.
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
    );
  }

  return <FormGuidance exercise={exercise} />;
};