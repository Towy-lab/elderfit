import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { useSubscription } from '../contexts/SubscriptionContext.js';

// Updated conversion functions
const kgToLbs = kg => Math.round(kg * 2.20462);
const lbsToKg = lbs => (lbs / 2.20462).toFixed(1);
const cmToInches = cm => Math.round(cm / 2.54);
const inchesToCm = inches => (inches * 2.54).toFixed(1);

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateProfile, refreshUser } = useAuth();
  const { tier } = useSubscription();
  
  const [units, setUnits] = useState({
    weight: 'kg',
    height: 'cm'
  });
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    fitnessLevel: 'beginner',
    healthConditions: [],
    goals: []
  });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        age: user.profile?.age?.toString() || '',
        height: user.profile?.height?.toString() || '',
        weight: user.profile?.weight?.toString() || '',
        fitnessLevel: user.profile?.fitnessLevel || 'beginner',
        goals: user.profile?.goals || [],
        healthConditions: user.profile?.healthConditions || []
      });
    }
  }, [user]);

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
        // Allow whole numbers for kg
        processedValue = numValue.toString();
      }
    } else if (name === 'height') {
      if (units.height === 'in') {
        // Convert whole number inches to cm with 1 decimal
        processedValue = inchesToCm(Math.round(numValue));
      } else {
        // Allow whole numbers for cm
        processedValue = numValue.toString();
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
      return value;
    }
    
    if (name === 'height') {
      if (units.height === 'in') {
        return Math.round(cmToInches(value));
      }
      return value;
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
      // Split the name into first and last name
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');

      // Format the profile data
      const profileData = {
        firstName,
        lastName,
        email: formData.email,
        profile: {
          age: formData.age ? parseInt(formData.age, 10) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          fitnessLevel: formData.fitnessLevel || 'beginner',
          goals: formData.goals || [],
          healthConditions: formData.healthConditions || []
        }
      };

      console.log('Sending profile data:', profileData);
      
      // Update the profile
      const response = await updateProfile(profileData);
      console.log('Received updated user data:', response.user);

      // Refresh user data to ensure we have the latest
      await refreshUser();

      // Update local form data with the response
      setFormData(prevData => ({
        ...prevData,
        fullName: `${response.user.firstName} ${response.user.lastName}`.trim(),
        email: response.user.email,
        age: response.user.profile?.age?.toString() || '',
        height: response.user.profile?.height?.toString() || '',
        weight: response.user.profile?.weight?.toString() || '',
        fitnessLevel: response.user.profile?.fitnessLevel || 'beginner',
        goals: response.user.profile?.goals || [],
        healthConditions: response.user.profile?.healthConditions || []
      }));

      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
      
      // Wait 2 seconds before redirecting
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Profile update error:', err);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to update profile'
      });
    } finally {
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