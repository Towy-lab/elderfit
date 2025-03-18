// src/pages/Dashboard.js - Updated with clear upgrade option and fixed syntax error
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import WorkoutCard from '../components/WorkoutCard';
import WorkoutProgress from '../components/WorkoutProgress';
import FavouriteExercises from '../components/FavouriteExercises';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import UpgradeCard from '../components/subscription/UpgradeCard';
import DashboardGuide from './DashboardGuide';

const Dashboard = () => {
  const { user } = useAuth();
  const { subscription, hasTierAccess, formatTierName, getValidUpgradeTiers } = useSubscription();
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  // Get valid upgrade options
  const upgradeOptions = getValidUpgradeTiers ? getValidUpgradeTiers() : ['premium', 'elite'];
  const currentTier = subscription?.tier || 'basic';
  
  // Fetch recommended workouts
  useEffect(() => {
    const getRecommendedWorkouts = async () => {
      try {
        setIsLoading(true);
        
        // Mock data for now - replace with actual API call
        const mockWorkouts = [
          {
            id: '1',
            title: 'Gentle Morning Stretch',
            duration: 15,
            difficulty: 'Beginner',
            imageUrl: '/images/gentle-stretch.jpg',
            description: 'Start your day with these gentle stretches to improve flexibility and mobility.'
          },
          {
            id: '2',
            title: 'Chair Strength Workout',
            duration: 20,
            difficulty: 'Beginner',
            imageUrl: '/images/chair-workout.jpg',
            description: 'Build strength while seated with this accessible workout.'
          },
          {
            id: '3',
            title: 'Balance Improvement',
            duration: 25,
            difficulty: 'Intermediate',
            imageUrl: '/images/balance.jpg',
            description: 'Exercises designed to improve stability and prevent falls.'
          }
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setRecommendedWorkouts(mockWorkouts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };
    
    getRecommendedWorkouts();
  }, [currentTier]);
  
  // Track dashboard visit for analytics
  useEffect(() => {
    // This would normally call an analytics service
    console.log('Dashboard viewed by user:', user?.id);
  }, [user]);
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Dashboard Guide component */}
      <DashboardGuide />
      
      <h1 className="text-3xl font-bold mb-6">Your Fitness Dashboard</h1>
      
      {/* Subscription Status Section */}
      <section className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Current Plan: <span className="text-indigo-600">{formatTierName(currentTier)}</span></h2>
            <p className="text-gray-600 mt-1">
              {currentTier === 'basic' 
                ? 'You are on our free Basic plan. Upgrade for more features!'
                : currentTier === 'premium'
                  ? 'You have access to our Premium features. Elite offers even more!'
                  : 'You have our top Elite plan with all features unlocked!'}
            </p>
          </div>
          
          {upgradeOptions.length > 0 && (
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              {upgradeOptions.map(tier => (
                <Link 
                  key={`upgrade-${tier}`}
                  to="/subscription/plans"
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    tier === 'premium' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  Upgrade to {formatTierName(tier)}
                </Link>
              ))}
              
              <Link
                to="/subscription/manage"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Manage Subscription
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* Progress Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
        <WorkoutProgress />
      </section>
      
      {/* Recommended Workouts Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Recommended Workouts</h2>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : isError ? (
          <EmptyState 
            message="Unable to load workouts right now. Please try again later." 
            actionText="Retry"
            actionHandler={() => window.location.reload()} 
          />
        ) : recommendedWorkouts.length === 0 ? (
          <EmptyState 
            message="No workouts available yet. Complete your profile to get personalized recommendations." 
            actionText="Update Profile" 
            actionHandler={() => window.location.href = '/profile'} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedWorkouts.map(workout => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </section>
      
      {/* Favorite Exercises Section - only for Premium and Elite */}
      {currentTier !== 'basic' && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Favorite Exercises</h2>
          <FavouriteExercises />
        </section>
      )}
      
      {/* Upgrade Prompt - only for Basic tier */}
      {currentTier === 'basic' && (
        <section className="mb-10">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:flex-1">
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">Unlock Premium Features!</h3>
                <p className="text-indigo-700 mb-4">
                  Upgrade to Premium or Elite to access personalized workout plans, video demonstrations, 
                  favorite exercise tracking, and more advanced features.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-indigo-700">Personalized workout recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-indigo-700">Professional video demonstrations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-indigo-700">Track your favorite exercises</span>
                  </li>
                </ul>
              </div>
              <div className="md:ml-6 flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/subscription/plans" 
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-center"
                >
                  View Premium Plans
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;