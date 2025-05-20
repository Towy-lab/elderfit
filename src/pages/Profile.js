import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import WorkoutHistory from '../components/WorkoutHistory';
import ExerciseHistory from '../components/ExerciseHistory';
import FavouriteExercises from '../components/FavouriteExercises'; // Corrected spelling

const Profile = () => {
  const { currentUser, updateProfile } = useAuth();
  const { userSubscription } = useSubscription();
  const [activeTab, setActiveTab] = useState('workouts');
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl font-bold">
              {currentUser?.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{currentUser?.displayName || 'User'}</h1>
              <p className="text-gray-600">{currentUser?.email}</p>
              
              <div className="mt-2 flex items-center">
                <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                  {userSubscription.charAt(0).toUpperCase() + userSubscription.slice(1)} Tier
                </span>
                {userSubscription !== 'elite' && (
                  <Link 
                    to={`/subscription/${userSubscription === 'basic' ? 'premium' : 'elite'}`} 
                    className="ml-2 text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    Upgrade
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('workouts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'workouts'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Workout History
            </button>
            <button
              onClick={() => setActiveTab('exercises')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'exercises'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Exercise History
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'favorites'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Favorites
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'workouts' && <WorkoutHistory />}
          {activeTab === 'exercises' && <ExerciseHistory />}
          {activeTab === 'favorites' && <FavouriteExercises />}
        </div>
      </div>
    </div>
  );
};

export default Profile;