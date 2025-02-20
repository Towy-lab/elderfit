import React, { useState } from 'react';
import { AlertTriangle, Activity, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useSafety } from '../../contexts/SafetyContext';

const painLevels = [
  { value: 0, label: 'No Pain', color: 'bg-green-100 text-green-700' },
  { value: 1, label: 'Mild', color: 'bg-yellow-100 text-yellow-700' },
  { value: 2, label: 'Moderate', color: 'bg-orange-100 text-orange-700' },
  { value: 3, label: 'Severe', color: 'bg-red-100 text-red-700' }
];

const PainTracker = ({ exerciseId }) => {
  const { logPainLevel, getPainHistory } = useSafety();
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Activity className="text-orange-500" />
        Pain & Discomfort Tracker
      </h2>

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
                <div>
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
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default PainTracker;