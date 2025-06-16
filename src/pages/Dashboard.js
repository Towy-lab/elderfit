// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import WorkoutCard from '../components/workouts/WorkoutCard';
import WorkoutProgress from '../components/WorkoutProgress';
import FavouriteExercises from '../components/FavouriteExercises';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import UpgradeCard from '../components/subscription/UpgradeCard';
import DashboardGuide from './DashboardGuide';
import { Shield, Activity, Award, BookOpen, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { subscription, hasAccess, formatTierName, getValidUpgradeTiers } = useSubscription();
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  // Extract the first name from user object
  // Check various possible formats
  const firstName = user?.firstName || // If firstName exists directly
                   (user?.name ? user.name.split(' ')[0] : null) || // If we need to split full name
                   user?.first_name || // If it's stored as first_name
                   (user?.profile?.firstName) || // Check profile object
                   'Friend'; // Default fallback
  
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
            name: 'Gentle Morning Stretch',
            duration: 15,
            level: 'Beginner',
            thumbnailUrl: 'https://images.unsplash.com/photo-1616279969862-90f1a57a0b75?auto=format&fit=crop&w=500&q=60',
            focusArea: 'Flexibility',
            description: 'Start your day with these gentle stretches to improve flexibility and mobility.'
          },
          {
            id: '2',
            name: 'Chair Strength Workout',
            duration: 20,
            level: 'Beginner',
            thumbnailUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=500&q=60',
            focusArea: 'Strength',
            description: 'Build strength while seated with this accessible workout.'
          },
          {
            id: '3',
            name: 'Balance Improvement',
            duration: 25,
            level: 'Intermediate',
            thumbnailUrl: 'https://images.unsplash.com/photo-1559888292-3c849f058cdf?auto=format&fit=crop&w=500&q=60',
            focusArea: 'Balance',
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
      
      <h1 className="text-3xl font-bold mb-6">Welcome, {firstName}!</h1>
      
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
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            {/* Show upgrade options if available */}
            {upgradeOptions.length > 0 && upgradeOptions.map(tier => (
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
            
            {/* Always show Manage Subscription button for paid tiers */}
            {currentTier !== 'basic' && (
              <Link
                to="/subscription/manage"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
              >
                Manage Subscription
              </Link>
            )}
            
            {/* Show Upgrade button for Basic tier if no specific upgrade options */}
            {currentTier === 'basic' && upgradeOptions.length === 0 && (
              <Link
                to="/subscription/plans"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
              >
                View Premium Plans
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Safety Features Link */}
      <section className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="text-blue-600" />
          <h3 className="font-medium">Safety Features</h3>
        </div>
        <p className="text-sm text-blue-600 mb-3">
          Access your safety tools and resources to exercise confidently.
        </p>
        <Link to="/safety" className="text-sm font-medium text-blue-700 hover:text-blue-900">
          View Safety Hub →
        </Link>
      </section>
      
      {/* Tier-Specific Content Link */}
      <section className="mb-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Your Subscription Content</h2>
        <p className="text-gray-600 mb-3">
          Access exclusive content available for your {formatTierName(currentTier)} subscription.
        </p>
        <Link 
          to={`/content/${currentTier}`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-block"
        >
          View {formatTierName(currentTier)} Content
        </Link>
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
                <h3 className="text-xl font-semibold text-indigo-800 mb-2">Unlock More Features!</h3>
                <p className="text-indigo-700 mb-4">
                  Upgrade to <span className="font-semibold text-indigo-700">Premium</span> or <span className="font-semibold text-purple-700">Elite</span> to access personalized workout plans, advanced analytics, exclusive content, and more.
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
                    <svg className="h-5 w-5 text-purple-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="ml-2 text-purple-700">Elite: AI-powered training, advanced analytics, family plan, and more</span>
                  </li>
                </ul>
              </div>
              <div className="md:ml-6 flex flex-col sm:flex-row gap-3">
                <Link 
                  to="/subscription/plans#premium" 
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium text-center"
                >
                  Unlock Premium
                </Link>
                <Link 
                  to="/subscription/plans#elite" 
                  className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium text-center"
                >
                  Unlock Elite
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Show upgrade prompts based on current tier */}
      {!hasAccess('premium') && (
        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-indigo-800 mb-3">Upgrade to Premium</h3>
          <p className="text-indigo-700 mb-4">
            Get access to all premium features and more with our Premium plan.
          </p>
          <Link
            to="/subscription/plans"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            View Premium Plans
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;