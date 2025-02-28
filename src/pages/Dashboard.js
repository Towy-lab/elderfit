// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import WorkoutCard from '../components/WorkoutCard';
import FavouriteExercises from '../components/FavouriteExercises';
import WorkoutProgress from '../components/WorkoutProgress';
import WorkoutStreak from '../components/achievements/WorkoutStreak';
import UpgradeCard from '../components/subscription/UpgradeCard';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { userSubscription, isLoading: subscriptionLoading } = useSubscription();
  const [featuredWorkouts, setFeaturedWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get the user's name for display
  const userName = currentUser?.displayName || currentUser?.name || 'Friend';

  useEffect(() => {
    // Fetch featured workouts based on subscription tier
    const fetchFeaturedWorkouts = async () => {
      setIsLoading(true);
      try {
        // Simulate API response - replace with actual API call in production
        const workouts = [
          { id: 1, title: 'Gentle Morning Routine', duration: '15 min', level: 'Beginner' },
          { id: 2, title: 'Chair Strength', duration: '20 min', level: 'Beginner' },
          { id: 3, title: 'Balance Basics', duration: '15 min', level: 'Beginner' },
        ];
        
        // Add more workouts for premium and elite tiers
        if (userSubscription === 'premium' || userSubscription === 'elite') {
          workouts.push(
            { id: 4, title: 'Advanced Balance', duration: '25 min', level: 'Intermediate' },
            { id: 5, title: 'Core Strength', duration: '20 min', level: 'Intermediate' }
          );
        }
        
        // Add exclusive workouts for elite tier
        if (userSubscription === 'elite') {
          workouts.push(
            { id: 6, title: 'Elite Full Body', duration: '30 min', level: 'Advanced' },
            { id: 7, title: 'Custom Recovery', duration: '25 min', level: 'Advanced' }
          );
        }
        
        setFeaturedWorkouts(workouts);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedWorkouts();
  }, [userSubscription]);

  if (subscriptionLoading || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Added extra padding at the top to prevent navbar overlap */}
      <div className="pt-6">
        <h1 className="text-2xl font-bold mb-6">Welcome, {userName}</h1>
        
        {/* Workout Streak - available to all tiers */}
        <div className="mb-8">
          <WorkoutStreak />
        </div>
        
        {/* Featured Workouts Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Featured Workouts</h2>
            <Link to="/workouts" className="text-indigo-600 hover:text-indigo-800">
              View All
            </Link>
          </div>
          
          {featuredWorkouts.length === 0 ? (
            <EmptyState message="No workouts available" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          )}
        </section>
        
        {/* Progress Section - Basic gets simple view, Premium/Elite get detailed */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          {userSubscription === 'basic' ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <WorkoutProgress simple={true} />
              {/* Upsell for more detailed progress */}
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-700">
                  Upgrade to Premium for detailed progress analytics and insights
                </p>
                <Link
                  to="/subscription/premium"
                  className="mt-2 inline-block text-sm text-white bg-indigo-600 px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          ) : (
            <WorkoutProgress detailed={true} />
          )}
        </section>
        
        {/* Premium Features - show in basic with upgrade prompt */}
        {userSubscription === 'basic' && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Premium Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UpgradeCard
                title="Personalized Calendar"
                description="Get a customized workout schedule that adapts to your needs"
                tier="premium"
              />
              <UpgradeCard
                title="Pain Tracking"
                description="Track and manage discomfort to stay safe while exercising"
                tier="premium"
              />
            </div>
          </section>
        )}
        
        {/* Elite Features - show in premium with upgrade prompt */}
        {userSubscription === 'premium' && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Elite Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UpgradeCard
                title="Professional Support"
                description="One-on-one guidance from certified fitness professionals"
                tier="elite"
              />
              <UpgradeCard
                title="Family Profiles"
                description="Manage routines for loved ones and track their progress"
                tier="elite"
              />
            </div>
          </section>
        )}
        
        {/* Professional Support Section - Elite Only */}
        {userSubscription === 'elite' && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Professional Support</h2>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-medium text-lg text-purple-800">Your Next Session</h3>
              <p className="mt-2">No upcoming sessions. Would you like to book one?</p>
              <Link
                to="/professional/booking"
                className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Book Consultation
              </Link>
            </div>
          </section>
        )}
        
        {/* Favorite Exercises - Available to all but with different limits */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Favorite Exercises</h2>
          <FavouriteExercises 
            limit={userSubscription === 'basic' ? 3 : userSubscription === 'premium' ? 10 : null} 
          />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;