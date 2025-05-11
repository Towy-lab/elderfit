import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const FITNESS_LEVELS = ['beginner', 'intermediate', 'advanced'];
const FITNESS_GOALS = [
  'Improve Strength',
  'Increase Flexibility',
  'Better Balance',
  'Weight Management',
  'Cardiovascular Health',
  'Joint Health',
  'General Fitness'
];

const ProfilePage = () => {
  const { user: authUser, updateProfile } = useAuth();
  
  // Initialize form data from auth context
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fitnessLevel: 'beginner',
    goals: [],
    healthConditions: [],
    equipment: []
  });

  // Update form data when authUser changes
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: `${authUser.firstName} ${authUser.lastName}`.trim(),
        email: authUser.email || '',
        fitnessLevel: authUser.profile?.fitnessLevel || 'beginner',
        goals: authUser.profile?.goals || [],
        healthConditions: authUser.profile?.healthConditions || [],
        equipment: authUser.profile?.equipment || []
      });
    }
  }, [authUser]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const arrayName = name.split('.')[0];
      const item = name.split('.')[1];
      const currentArray = formData[arrayName] || [];
      
      if (e.target.checked) {
        setFormData(prev => ({
          ...prev,
          [arrayName]: [...currentArray, item]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [arrayName]: currentArray.filter(i => i !== item)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update profile in auth context
      await updateProfile({
        name: formData.name,
        email: formData.email,
        profile: {
          fitnessLevel: formData.fitnessLevel,
          goals: formData.goals,
          healthConditions: formData.healthConditions,
          equipment: formData.equipment
        }
      });
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fitnessLevel">
              Fitness Level
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="fitnessLevel"
              name="fitnessLevel"
              value={formData.fitnessLevel}
              onChange={handleChange}
              required
            >
              {FITNESS_LEVELS.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Fitness Goals
            </label>
            <div className="space-y-2">
              {FITNESS_GOALS.map(goal => (
                <label key={goal} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={`goals.${goal}`}
                    checked={formData.goals.includes(goal)}
                    onChange={handleChange}
                    className="form-checkbox h-4 w-4 text-indigo-600"
                  />
                  <span>{goal}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Subscription Management</h2>
        <p className="mb-4">Manage your ElderFit Secrets subscription.</p>
        
        <Link
          to="/subscription/manage"
          className="inline-block bg-indigo-100 text-indigo-700 hover:bg-indigo-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Manage Subscription
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;