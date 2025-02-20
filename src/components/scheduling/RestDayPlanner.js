import React, { useState } from 'react';
import { 
  Battery, 
  Calendar,
  Check,
  AlertCircle,
  Info,
  Edit2
} from 'lucide-react';
import { useScheduling } from '../../contexts/SchedulingContext';
import { useSafety } from '../../contexts/SafetyContext';

const RestDayPlanner = () => {
  const { restDays, setRestDay, removeRestDay } = useScheduling();
  const { getFatigueLevel } = useSafety();
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    minRestDays: 2,
    preferredRestDays: ['Sunday', 'Thursday'],
    autoSchedule: true
  });

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];

  const fatigueLevel = getFatigueLevel();

  const getRestRecommendation = () => {
    if (fatigueLevel >= 8) return 'High fatigue detected. Consider taking 2-3 rest days.';
    if (fatigueLevel >= 5) return 'Moderate fatigue. A rest day would be beneficial.';
    return 'Low fatigue. Continue with your regular schedule.';
  };

  const toggleRestDay = (day) => {
    setPreferences(prev => ({
      ...prev,
      preferredRestDays: prev.preferredRestDays.includes(day)
        ? prev.preferredRestDays.filter(d => d !== day)
        : [...prev.preferredRestDays, day]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Battery className="text-blue-500" />
            Rest Day Planner
          </h2>
          <p className="text-gray-600 mt-1">
            Plan your rest days for optimal recovery
          </p>
        </div>
      </div>

      {/* Fatigue Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        fatigueLevel >= 8 
          ? 'bg-red-50 text-red-700'
          : fatigueLevel >= 5
          ? 'bg-yellow-50 text-yellow-700'
          : 'bg-green-50 text-green-700'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle size={20} />
          <h3 className="font-medium">Current Fatigue Level</h3>
        </div>
        <p>{getRestRecommendation()}</p>
        <div className="mt-2 bg-white bg-opacity-50 rounded-full h-2">
          <div 
            className={`h-full rounded-full ${
              fatigueLevel >= 8 
                ? 'bg-red-500'
                : fatigueLevel >= 5
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${fatigueLevel * 10}%` }}
          />
        </div>
      </div>

      {/* Rest Day Preferences */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Rest Day Preferences</h3>
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-blue-500 hover:text-blue-600"
          >
            <Edit2 size={16} />
          </button>
        </div>

        {showPreferences ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Rest Days
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleRestDay(day)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      preferences.preferredRestDays.includes(day)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rest Days per Week
              </label>
              <select
                value={preferences.minRestDays}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  minRestDays: parseInt(e.target.value)
                }))}
                className="w-full p-2 border rounded-md"
              >
                <option value={1}>1 day</option>
                <option value={2}>2 days</option>
                <option value={3}>3 days</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={preferences.autoSchedule}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  autoSchedule: e.target.checked
                }))}
                className="rounded"
              />
              <label className="text-sm text-gray-700">
                Automatically schedule rest days based on fatigue level
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={16} />
              <span>
                Preferred days: {preferences.preferredRestDays.join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check size={16} />
              <span>Minimum {preferences.minRestDays} rest days per week</span>
            </div>
          </div>
        )}
      </div>

      {/* Recovery Tips */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-3 text-blue-700">
          <Info size={20} />
          <h3 className="font-medium">Recovery Tips</h3>
        </div>
        <ul className="space-y-2 text-blue-600">
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Get 7-9 hours of quality sleep
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Stay hydrated and maintain proper nutrition
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Practice light stretching or walking
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
            Use relaxation techniques to reduce stress
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RestDayPlanner;