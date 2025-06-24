// src/components/safety/TieredPainTracker.js
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.js';
import { Button } from '../../components/ui/button.js';
import { Badge } from '../../components/ui/badge.js';
import { Progress } from '../../components/ui/progress.js';
import { Slider } from '../../components/ui/slider.js';
import { Textarea } from '../../components/ui/textarea.js';
import { Pain, Activity, TrendingUp, Calendar, AlertTriangle, CheckCircle, ThumbsUp, ThumbsDown, Lock } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyContext.js';
import { useSubscription } from '../../contexts/SubscriptionContext.js';
import TierContentManager from '../subscription/TierContentManager.js';

const painLevels = [
  { value: 0, label: 'No Pain', color: 'bg-green-100 text-green-700' },
  { value: 1, label: 'Mild', color: 'bg-yellow-100 text-yellow-700' },
  { value: 2, label: 'Moderate', color: 'bg-orange-100 text-orange-700' },
  { value: 3, label: 'Severe', color: 'bg-red-100 text-red-700' }
];

export const TieredPainTracker = ({ exerciseId }) => {
  const { logPainLevel, getPainHistory, generatePainInsights, hasEliteAccess } = useSafety();
  const { hasAccess } = useSubscription();
  const [currentPain, setCurrentPain] = useState(0);
  const [notes, setNotes] = useState('');
  
  const painHistory = getPainHistory(exerciseId);

  const handleSubmit = (e) => {
    e.preventDefault();
    logPainLevel(exerciseId, {
      level: currentPain,
      notes,
      timestamp: new Date().toISOString()
    });
    setNotes('');
  };

  // Preview content for basic tier
  const BasicPainTrackerPreview = () => (
    <div>
      <p className="text-gray-600 mb-4">
        Tracking pain and discomfort helps you exercise safely and effectively.
      </p>
      <div className="grid grid-cols-4 gap-2 opacity-50">
        {painLevels.map(({ value, label, color }) => (
          <div
            key={value}
            className={`p-3 rounded-lg ${color}`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Activity className="text-orange-500" />
        Pain & Discomfort Tracker
      </h2>

      {/* Premium Feature - Full Pain Tracker */}
      <TierContentManager
        requiredTier="premium"
        featureName="pain tracking"
        preview={true}
        previewContent={<BasicPainTrackerPreview />}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pain Level Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Pain Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {painLevels.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setCurrentPain(value)}
                  className={`p-3 rounded-lg transition-colors ${
                    currentPain === value
                      ? color
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border rounded-lg h-24 resize-none"
              placeholder="Describe any specific areas of discomfort..."
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Log Pain Level
          </button>
        </form>

        {/* Pain History */}
        {painHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Recent History</h3>
            <div className="space-y-3">
              {painHistory.slice(0, 5).map((entry, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className={`p-2 rounded-full ${
                    painLevels[entry.level].color
                  }`}>
                    {entry.level <= 1 ? (
                      <ThumbsUp size={16} />
                    ) : (
                      <ThumbsDown size={16} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {painLevels[entry.level].label}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </p>
                    {entry.notes && (
                      <p className="text-sm text-gray-600 mt-1">
                        {entry.notes}
                      </p>
                    )}
                    
                    {/* Elite Tier Analysis - Show insights if available */}
                    {hasEliteAccess() && entry.insights && (
                      <div className="mt-2 p-2 bg-purple-50 rounded text-sm text-purple-700 border border-purple-100">
                        <span className="font-medium">Analysis:</span> {entry.insights}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {painHistory.length > 5 && (
              <button className="mt-3 w-full p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                View Full History
              </button>
            )}
          </div>
        )}

        {/* Warning Message */}
        {currentPain >= 2 && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start gap-3">
            <AlertTriangle className="flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">Warning</p>
              <p className="text-sm">
                You're experiencing significant pain. Consider:
                <ul className="list-disc ml-4 mt-2">
                  <li>Stopping the exercise</li>
                  <li>Consulting your healthcare provider</li>
                  <li>Trying a modified version of the exercise</li>
                </ul>
              </p>
            </div>
          </div>
        )}

        {/* Elite Upgrade Promo */}
        {!hasAccess('elite') && (
          <div className="mt-6 bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Lock className="text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-purple-700">Elite Feature</p>
                <p className="text-sm text-purple-600 mb-2">
                  Upgrade to Elite for personalized pain management strategies and direct consultation with health professionals.
                </p>
                <a 
                  href="/subscription/plans" 
                  className="text-sm font-medium text-purple-600 hover:text-purple-800"
                  aria-label="Upgrade to Elite subscription for advanced pain management"
                >
                  Upgrade to Elite →
                </a>
              </div>
            </div>
          </div>
        )}
        
        {/* Elite Pain Analysis */}
        {hasAccess('elite') && (
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h3 className="font-medium text-purple-800 mb-3">Elite Pain Analysis</h3>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-purple-700 mb-2">Pain Pattern</h4>
              <div className="h-32 bg-white rounded-lg border border-purple-100 p-3 flex items-center justify-center">
                <p className="text-gray-500">Professional pain pattern analysis chart</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-purple-700 mb-2">Professional Recommendation</h4>
              <p className="text-sm text-purple-700">
                {painHistory.some(entry => entry.level >= 2) 
                  ? "Based on your pain reports, we recommend modifying your technique for this exercise. Schedule a consultation to review your form with a professional."
                  : "Your pain levels are within normal range for this exercise. Continue with your current approach and monitor any changes."}
              </p>
              
              <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
                Schedule Pain Management Consultation
              </button>
            </div>
          </div>
        )}
      </TierContentManager>
    </div>
  );
};

export default TieredPainTracker;