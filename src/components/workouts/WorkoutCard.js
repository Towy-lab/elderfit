import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Clock, BarChart2, Target } from 'lucide-react';

const WorkoutCard = ({ workout }) => {
  const { hasAccess, formatTierName } = useSubscription();
  const userHasAccess = hasAccess(workout.tier);
  
  // Function to get button color based on workout level
  const getLevelButtonColor = (level) => {
    switch(level) {
      case 'Beginner':
        return 'bg-green-600 hover:bg-green-700';
      case 'Intermediate':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'Advanced':
        return 'bg-red-600 hover:bg-red-700';
      case 'All Levels':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-purple-600 hover:bg-purple-700';
    }
  };
  
  const buttonColorClass = getLevelButtonColor(workout.level);
  
  // Get appropriate image URL based on workout type
  const getWorkoutImage = (workout) => {
    if (workout.thumbnailUrl && (workout.thumbnailUrl.startsWith('http') || workout.thumbnailUrl.startsWith('https'))) {
      return workout.thumbnailUrl;
    }
    if (workout.focusArea) {
      switch (workout.focusArea) {
        case 'Flexibility':
          return 'https://images.unsplash.com/photo-1616279969862-90f1a57a0b75?auto=format&fit=crop&w=500&q=60';
        case 'Balance':
          return 'https://images.unsplash.com/photo-1559888292-3c849f058cdf?auto=format&fit=crop&w=500&q=60';
        case 'Strength':
          return 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=500&q=60';
        case 'Mobility':
          return 'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?auto=format&fit=crop&w=500&q=60';
        case 'Relaxation':
          return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=500&q=60';
        case 'Heart Health':
          return 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=500&q=60';
        case 'Full Body':
          return 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=500&q=60';
        default:
          break;
      }
    }
    return 'https://images.unsplash.com/photo-1520080816484-0e41b8536b2f?auto=format&fit=crop&w=500&q=60';
  };
  
  const fallbackImage = 'https://images.unsplash.com/photo-1520080816484-0e41b8536b2f?auto=format&fit=crop&w=500&q=60';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col h-full">
      <div className="relative">
        <img 
          src={getWorkoutImage(workout)} 
          alt={workout.name}
          className="w-full h-48 object-cover"
          onError={e => {
            if (e.target.src !== fallbackImage) {
              e.target.src = fallbackImage;
            }
          }}
        />
        {!userHasAccess && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white p-4">
            <span className="text-sm font-semibold mb-2">
              {formatTierName(workout.tier)} Content
            </span>
            <Link 
              to="/subscription" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-md text-sm"
            >
              Upgrade to Access
            </Link>
          </div>
        )}
        <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {workout.tier}
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-medium text-lg mb-1">{workout.name}</h3>
        
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="flex items-center text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
            <Clock size={12} className="mr-1" />
            {workout.duration} min
          </span>
          <span className="flex items-center text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
            <BarChart2 size={12} className="mr-1" />
            {workout.level}
          </span>
          <span className="flex items-center text-xs px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
            <Target size={12} className="mr-1" />
            {workout.focusArea}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">{workout.description}</p>
        
        <div className="mt-auto pt-2">
          {userHasAccess ? (
            <Link 
              to={`/workouts/${workout.id}`} 
              className={`w-full block text-center py-2 ${buttonColorClass} text-white rounded-md`}
            >
              Start Workout
            </Link>
          ) : (
            <button 
              disabled
              className="w-full py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed"
            >
              Locked Content
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
