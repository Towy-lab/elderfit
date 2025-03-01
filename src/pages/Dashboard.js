import React, { useEffect, useState } from 'react';
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
  const { user, isAuthenticated } = useAuth();
  const { tier } = useSubscription();
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  console.log("Dashboard rendered with auth state:", { 
    isAuthenticated, 
    user,
    userExists: !!user,
    userStorageExists: !!localStorage.getItem('user'),
    tier
  });
  
  // Fetch recommended workouts
  useEffect(() => {
    const getRecommendedWorkouts = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching workouts for tier:", tier);
        
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
        
        console.log("Workouts loaded:", mockWorkouts);
        setRecommendedWorkouts(mockWorkouts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching workouts:', error);
        setIsError(true);
        setIsLoading(false);
      }
    };
    
    getRecommendedWorkouts();
  }, [tier]);
  
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
      
      {/* Progress Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
        <WorkoutProgress />
      </section>
      
      {/* Recommended Workouts Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Recommended Workouts</h2>
        {isLoading ? (
          <LoadingSpinner />
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
      {tier !== 'basic' && (
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Your Favorite Exercises</h2>
          <FavouriteExercises />
        </section>
      )}
      
      {/* Upgrade Prompt - only for Basic tier */}
      {tier === 'basic' && (
        <section className="mb-10">
          <UpgradeCard 
            title="Unlock More Personalized Content!" 
            description="Upgrade to Premium or Elite to access personalized workout plans, video demonstrations, and track your favorite exercises."
          />
        </section>
      )}

      {/* Debug Information - only visible during development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 p-4 border border-gray-300 rounded bg-gray-50">
          <h3 className="font-bold mb-2">Debug Information</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ 
              user,
              isAuthenticated,
              tier,
              localStorage: localStorage.getItem('user')
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;