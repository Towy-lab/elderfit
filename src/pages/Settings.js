import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

// Updated conversion functions
const kgToLbs = kg => Math.round(kg * 2.20462);
const lbsToKg = lbs => (lbs / 2.20462).toFixed(1);
const cmToInches = cm => Math.round(cm / 2.54);
const inchesToCm = inches => (inches * 2.54).toFixed(1);

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { tier } = useSubscription();
  
  const [units, setUnits] = useState({
    weight: 'kg',
    height: 'cm'
  });
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    age: user?.age || '',
    height: user?.height || '',
    weight: user?.weight || '',
    fitnessLevel: user?.fitnessLevel || 'beginner',
    healthConditions: user?.healthConditions || [],
    goals: user?.goals || []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Convert displayed values based on selected units
  const displayedWeight = units.weight === 'lbs' && formData.weight 
    ? kgToLbs(formData.weight) 
    : formData.weight;

  const displayedHeight = units.height === 'in' && formData.height 
    ? cmToInches(formData.height) 
    : formData.height;

  const handleUnitToggle = (measurement) => {
    setUnits(prev => {
      const newUnits = {
        ...prev,
        [measurement]: measurement === 'weight' 
          ? (prev.weight === 'kg' ? 'lbs' : 'kg')
          : (prev.height === 'cm' ? 'in' : 'cm')
      };
      return newUnits;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For non-measurement fields, directly update the value
    if (!['weight', 'height'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      return;
    }
    
    // Handle measurement fields with unit conversion
    // Handle empty input
    if (value === '') {
      setFormData(prev => ({ ...prev, [name]: '' }));
      return;
    }

    // Convert string to number
    const numValue = parseFloat(value);
    
    // Validate number input
    if (isNaN(numValue)) {
      return;
    }

    let processedValue;
    
    if (name === 'weight') {
      if (units.weight === 'lbs') {
        // Convert whole number lbs to kg with 1 decimal
        processedValue = lbsToKg(Math.round(numValue));
      } else {
        // Keep kg to 1 decimal place
        processedValue = numValue.toFixed(1);
      }
    } else if (name === 'height') {
      if (units.height === 'in') {
        // Convert whole number inches to cm with 1 decimal
        processedValue = inchesToCm(Math.round(numValue));
      } else {
        // Keep cm to 1 decimal place
        processedValue = numValue.toFixed(1);
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  // Get display value with appropriate formatting
  const getDisplayValue = (name, value) => {
    if (!value) return '';
    
    if (name === 'weight') {
      if (units.weight === 'lbs') {
        return Math.round(kgToLbs(value));
      }
      return parseFloat(value).toFixed(1);
    }
    
    if (name === 'height') {
      if (units.height === 'in') {
        return Math.round(cmToInches(value));
      }
      return parseFloat(value).toFixed(1);
    }
    
    return value;
  };

  const healthConditionOptions = [
    'Arthritis',
    'High Blood Pressure',
    'Diabetes',
    'Heart Condition',
    'Joint Pain',
    'Balance Issues',
    'Limited Mobility'
  ];

  const goalOptions = [
    'Improve Strength',
    'Better Balance',
    'Increase Flexibility',
    'Weight Management',
    'Daily Activities',
    'Reduce Pain',
    'Better Sleep'
  ];

  const handleMultiSelect = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateProfile({
        ...formData,
        name: formData.fullName
      });
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });

      // Show success message briefly before redirecting
      setTimeout(() => {
        navigate('/dashboard'); // Redirect to dashboard
      }, 1000); // Wait 1 second to show the success message

    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to update profile. Please try again.'
      });
      setIsLoading(false);
    }
  };

  const UnitToggleButton = ({ currentUnit, units, onToggle }) => (
    <div className="inline-flex rounded-md shadow-sm">
      <button
        type="button"
        onClick={() => onToggle(units[0].value)}
        className={`px-3 py-2 text-sm font-medium rounded-l-md border ${
          currentUnit === units[0].value
            ? 'bg-blue-50 text-blue-600 border-blue-600 z-10'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        {units[0].label}
      </button>
      <button
        type="button"
        onClick={() => onToggle(units[1].value)}
        className={`px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b -ml-px ${
          currentUnit === units[1].value
            ? 'bg-blue-50 text-blue-600 border-blue-600 z-10'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        {units[1].label}
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        {message.text && (
          <div className={`mb-4 p-4 rounded ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </section>

          {/* Physical Information with improved unit toggles */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Physical Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Age Field */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Height Field */}
              <div className="form-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Height
                  </label>
                  <UnitToggleButton
                    currentUnit={units.height}
                    units={[
                      { value: 'cm', label: 'cm' },
                      { value: 'in', label: 'inches' }
                    ]}
                    onToggle={(unit) => setUnits(prev => ({ ...prev, height: unit }))}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="height"
                    value={getDisplayValue('height', formData.height)}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step={units.height === 'in' ? "1" : "0.1"}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {units.height === 'cm' 
                      ? `${parseFloat(formData.height).toFixed(1)} cm ≈ ${cmToInches(formData.height)} inches` 
                      : `${Math.round(cmToInches(formData.height))} inches ≈ ${parseFloat(formData.height).toFixed(1)} cm`}
                  </div>
                </div>
              </div>

              {/* Weight Field */}
              <div className="form-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Weight
                  </label>
                  <UnitToggleButton
                    currentUnit={units.weight}
                    units={[
                      { value: 'kg', label: 'kg' },
                      { value: 'lbs', label: 'lbs' }
                    ]}
                    onToggle={(unit) => setUnits(prev => ({ ...prev, weight: unit }))}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="weight"
                    value={getDisplayValue('weight', formData.weight)}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    step={units.weight === 'lbs' ? "1" : "0.1"}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {units.weight === 'kg' 
                      ? `${parseFloat(formData.weight).toFixed(1)} kg ≈ ${kgToLbs(formData.weight)} lbs` 
                      : `${Math.round(kgToLbs(formData.weight))} lbs ≈ ${parseFloat(formData.weight).toFixed(1)} kg`}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Fitness Level */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Fitness Level</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Fitness Level
              </label>
              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </section>

          {/* Health Conditions */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Health Conditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthConditionOptions.map(condition => (
                <div key={condition} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`health-${condition}`}
                    value={condition}
                    checked={formData.healthConditions.includes(condition)}
                    onChange={(e) => handleMultiSelect(e, 'healthConditions')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`health-${condition}`} className="ml-2 text-sm text-gray-700">
                    {condition}
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Fitness Goals */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Fitness Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalOptions.map(goal => (
                <div key={goal} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`goal-${goal}`}
                    value={goal}
                    checked={formData.goals.includes(goal)}
                    onChange={(e) => handleMultiSelect(e, 'goals')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`goal-${goal}`} className="ml-2 text-sm text-gray-700">
                    {goal}
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-md font-medium
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
              `}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;