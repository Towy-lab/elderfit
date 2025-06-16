import React from 'react';
import { AlertCircle, Check, Info } from 'lucide-react';

export const FormFeedback = ({ feedback }) => {
  if (!feedback) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Form Analysis</h3>
      
      {/* Immediate Feedback */}
      {feedback.immediate && feedback.immediate.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Immediate Feedback</h4>
          <ul className="space-y-2">
            {feedback.immediate.map((item, index) => (
              <li key={index} className="flex items-start">
                <AlertCircle className="text-yellow-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safety Alerts */}
      {feedback.safetyAlerts && feedback.safetyAlerts.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-red-600 mb-2">Safety Alerts</h4>
          <ul className="space-y-2">
            {feedback.safetyAlerts.map((alert, index) => (
              <li key={index} className="flex items-start">
                <AlertCircle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-600">{alert}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {feedback.suggestions && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Suggestions</h4>
          <ul className="space-y-2">
            {Object.entries(feedback.suggestions).map(([area, suggestions]) => (
              <li key={area} className="flex items-start">
                <Check className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                <div>
                  <span className="font-medium capitalize">{area}:</span>
                  <ul className="ml-6 mt-1 space-y-1">
                    {suggestions && suggestions.map((suggestion, index) => (
                      <li key={index} className="text-gray-600">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Issues Found */}
      {(!feedback.immediate || feedback.immediate.length === 0) &&
       (!feedback.safetyAlerts || feedback.safetyAlerts.length === 0) &&
       (!feedback.suggestions || Object.keys(feedback.suggestions).length === 0) && (
        <div className="flex items-center text-green-600">
          <Check className="mr-2" />
          <span>Good form! Keep up the good work.</span>
        </div>
      )}
    </div>
  );
}; 