import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  MessageCircle, 
  AlertTriangle, 
  Check,
  Save,
  RefreshCcw
} from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';

const ExerciseCustomization = ({ exercise, onSave }) => {
  const { getDifficultyLevel } = useProgress();
  const [settings, setSettings] = useState({
    difficulty: 'standard',
    modifications: [],
    personalNotes: '',
    limitations: [],
    equipment: []
  });

  const difficultyOptions = [
    { value: 'easier', label: 'Easier Version', color: 'bg-green-100 text-green-700' },
    { value: 'standard', label: 'Standard Version', color: 'bg-blue-100 text-blue-700' },
    { value: 'challenging', label: 'More Challenging', color: 'bg-orange-100 text-orange-700' }
  ];

  const commonModifications = {
    'seated': 'Perform exercise while seated',
    'supported': 'Use wall or chair for support',
    'reduced-range': 'Reduce range of motion',
    'assisted': 'Use assistance or support',
    'alternative-grip': 'Modified hand position',
    'tempo': 'Slower movement speed'
  };

  const limitationOptions = [
    'Balance Issues',
    'Joint Pain',
    'Limited Mobility',
    'Arthritis',
    'Back Pain',
    'Knee Problems'
  ];

  const equipmentOptions = [
    'Chair',
    'Resistance Band',
    'Light Weights',
    'Yoga Mat',
    'Wall Space',
    'Pillow'
  ];

  useEffect(() => {
    // Load existing customizations if available
    const savedSettings = localStorage.getItem(`exercise_settings_${exercise.id}`);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [exercise.id]);

  const handleSave = () => {
    localStorage.setItem(
      `exercise_settings_${exercise.id}`,
      JSON.stringify(settings)
    );
    onSave(settings);
  };

  const handleReset = () => {
    const defaultSettings = {
      difficulty: 'standard',
      modifications: [],
      personalNotes: '',
      limitations: [],
      equipment: []
    };
    setSettings(defaultSettings);
    localStorage.removeItem(`exercise_settings_${exercise.id}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Difficulty Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Sliders size={20} />
          Difficulty Level
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {difficultyOptions.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => setSettings(prev => ({ ...prev, difficulty: value }))}
              className={`p-3 rounded-lg border transition-all ${
                settings.difficulty === value
                  ? `${color} border-transparent`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Modifications */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Available Modifications</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(commonModifications).map(([key, description]) => (
            <div
              key={key}
              className="flex items-start gap-2"
            >
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  modifications: prev.modifications.includes(key)
                    ? prev.modifications.filter(m => m !== key)
                    : [...prev.modifications, key]
                }))}
                className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  settings.modifications.includes(key)
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {settings.modifications.includes(key) && <Check size={12} />}
              </button>
              <div>
                <p className="font-medium">{key}</p>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Physical Limitations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle size={20} />
          Physical Limitations
        </h3>
        <div className="flex flex-wrap gap-2">
          {limitationOptions.map(limitation => (
            <button
              key={limitation}
              onClick={() => setSettings(prev => ({
                ...prev,
                limitations: prev.limitations.includes(limitation)
                  ? prev.limitations.filter(l => l !== limitation)
                  : [...prev.limitations, limitation]
              }))}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                settings.limitations.includes(limitation)
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {limitation}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Needed */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Equipment Needed</h3>
        <div className="flex flex-wrap gap-2">
          {equipmentOptions.map(item => (
            <button
              key={item}
              onClick={() => setSettings(prev => ({
                ...prev,
                equipment: prev.equipment.includes(item)
                  ? prev.equipment.filter(e => e !== item)
                  : [...prev.equipment, item]
              }))}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                settings.equipment.includes(item)
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Personal Notes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <MessageCircle size={20} />
          Personal Notes
        </h3>
        <textarea
          value={settings.personalNotes}
          onChange={(e) => setSettings(prev => ({
            ...prev,
            personalNotes: e.target.value
          }))}
          placeholder="Add any personal notes about this exercise..."
          className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCcw size={16} />
          Reset
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ExerciseCustomization;