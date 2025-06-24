import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';
import { useSubscription } from '../contexts/SubscriptionContext.js';
import LoadingSpinner from './LoadingSpinner.js';
import EmptyState from './EmptyState.js';

const FavouriteExercises = ({ limit }) => {
  const [favourites, setFavourites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userSubscription } = useSubscription();

  useEffect(() => {
    const fetchFavourites = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, you would call your API
        // const response = await api.get('/favourites');
        
        // For now, we'll simulate with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockFavourites = [
          { id: 1, name: 'Seated Leg Raises', type: 'Strength', difficulty: 'Beginner', target: 'Legs' },
          { id: 2, name: 'Chair Squats', type: 'Strength', difficulty: 'Beginner', target: 'Full Body' },
          { id: 3, name: 'Wall Push-ups', type: 'Strength', difficulty: 'Beginner', target: 'Upper Body' },
          { id: 4, name: 'Seated Shoulder Press', type: 'Strength', difficulty: 'Beginner', target: 'Shoulders' },
          { id: 5, name: 'Chair Yoga Flow', type: 'Flexibility', difficulty: 'Beginner', target: 'Full Body' },
          { id: 6, name: 'Balance Ball Sits', type: 'Balance', difficulty: 'Intermediate', target: 'Core' },
          { id: 7, name: 'Resistance Band Rows', type: 'Strength', difficulty: 'Intermediate', target: 'Back' },
        ];
        
        // Apply limit based on subscription if provided
        let limitedFavourites = mockFavourites;
        if (limit) {
          limitedFavourites = mockFavourites.slice(0, limit);
        }
        
        setFavourites(limitedFavourites);
      } catch (error) {
        console.error('Error fetching favourites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFavourites();
  }, [limit]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (favourites.length === 0) {
    return (
      <EmptyState 
        message="You haven't added any favourite exercises yet" 
        action={
          <Link 
            to="/exercises" 
            className="mt-2 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Browse Exercises
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favourites.map((exercise) => (
          <div key={exercise.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <h3 className="font-medium text-lg">{exercise.name}</h3>
            <div className="mt-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Type: {exercise.type}</span>
                <span>Target: {exercise.target}</span>
              </div>
              <div className="mt-1">
                <span>Difficulty: {exercise.difficulty}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between">
              <Link
                to={`/exercises/${exercise.id}`}
                className="text-indigo-600 hover:text-indigo-800"
              >
                View Exercise
              </Link>
              <button className="text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Show subscription limit info if applicable */}
      {limit && favourites.length >= limit && userSubscription !== 'elite' && (
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg text-center">
          <p className="text-indigo-700">
            {userSubscription === 'basic' 
              ? 'Upgrade to Premium to save more favorite exercises!' 
              : 'Upgrade to Elite for unlimited favorite exercises!'}
          </p>
          <Link
            to={`/subscription/${userSubscription === 'basic' ? 'premium' : 'elite'}`}
            className="mt-2 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Upgrade Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavouriteExercises;