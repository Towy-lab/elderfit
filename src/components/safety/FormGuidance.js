import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, X, Eye, Shield } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { formAnalysisService } from '../../services/ai/formAnalysis';
import { safetyMonitoringService } from '../../services/ai/safetyMonitoring';

const FormGuidance = ({ exercise }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formAnalysis, setFormAnalysis] = useState(null);
  const [safetyData, setSafetyData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { logFormCheck } = useSafety();
  const { hasTierAccess } = useSubscription();

  useEffect(() => {
    // Ensure only Elite users can access this component
    if (!hasTierAccess('elite')) {
      return;
    }

    if (exercise) {
      startFormAnalysis();
    }
  }, [exercise, hasTierAccess]);

  const startFormAnalysis = async () => {
    if (!hasTierAccess('elite')) {
      return;
    }

    setIsAnalyzing(true);
    try {
      // Get video stream from user's camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Start form analysis
      const analysis = await formAnalysisService.analyzeForm(exercise.id, stream);
      setFormAnalysis(analysis);

      // Start safety monitoring
      const safety = await safetyMonitoringService.monitorWorkout(
        exercise.id,
        { /* user data */ },
        { formData: stream }
      );
      setSafetyData(safety);

      // Log form check
      logFormCheck(exercise.id, {
        step: currentStep,
        passed: analysis.feedback.immediate.length === 0,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error in form analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

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

  const renderFormFeedback = () => {
    if (!formAnalysis) return null;

    return (
      <div className="space-y-4">
        {/* Immediate Feedback */}
        {formAnalysis.feedback.immediate.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Immediate Feedback</h4>
            <ul className="space-y-1">
              {formAnalysis.feedback.immediate.map((feedback, index) => (
                <li key={index} className="flex items-start text-yellow-700">
                  <AlertCircle size={16} className="mt-1 mr-2 flex-shrink-0" />
                  <span>{feedback}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Form Suggestions */}
        {formAnalysis.feedback.suggestions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Form Suggestions</h4>
            <ul className="space-y-1">
              {Object.entries(formAnalysis.feedback.suggestions).map(([area, suggestions]) => (
                <li key={area} className="text-blue-700">
                  <span className="font-medium">{area}:</span> {suggestions}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safety Alerts */}
        {formAnalysis.feedback.safetyAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Safety Alerts</h4>
            <ul className="space-y-1">
              {formAnalysis.feedback.safetyAlerts.map((alert, index) => (
                <li key={index} className="flex items-start text-red-700">
                  <Shield size={16} className="mt-1 mr-2 flex-shrink-0" />
                  <span>{alert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderSafetyData = () => {
    if (!safetyData) return null;

    return (
      <div className="mt-6 space-y-4">
        {/* Safety Score */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Safety Score</h4>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${safetyData.safetyScore.score * 100}%` }}
              ></div>
            </div>
            <span className="ml-2 text-green-700 font-medium">
              {Math.round(safetyData.safetyScore.score * 100)}%
            </span>
          </div>
        </div>

        {/* Recommendations */}
        {safetyData.recommendations && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2">Recommendations</h4>
            <ul className="space-y-2">
              {Object.entries(safetyData.recommendations).map(([type, recs]) => (
                <li key={type} className="text-purple-700">
                  <span className="font-medium capitalize">{type}:</span>
                  <ul className="mt-1 space-y-1">
                    {recs.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <Check size={16} className="mt-1 mr-2 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Form Analysis Status */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Form Analysis</h3>
        {isAnalyzing && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm">Analyzing...</span>
          </div>
        )}
      </div>

      {/* Form Feedback */}
      {renderFormFeedback()}

      {/* Safety Data */}
      {renderSafetyData()}

      {/* Form Checklist */}
      <div className="mt-6">
        <h4 className="font-medium text-gray-900 mb-4">Form Checklist</h4>
        <div className="space-y-4">
          {formChecklist.map((step, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${
                index === currentStep 
                  ? 'border-blue-200 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <h5 className="font-medium text-gray-900 mb-2">{step.title}</h5>
              <p className="text-gray-600 mb-3">{step.description}</p>
              <ul className="space-y-2">
                {step.checkpoints.map((checkpoint, cIndex) => (
                  <li key={cIndex} className="flex items-start">
                    <Check size={16} className="mt-1 mr-2 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{checkpoint}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Form Check Buttons */}
      <div className="flex gap-3 mt-6">
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
    </div>
  );
};

export default FormGuidance;