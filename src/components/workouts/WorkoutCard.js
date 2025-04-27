import React from 'react';
import { Link } from 'react-router-dom';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { Clock, BarChart2, Target } from 'lucide-react';

const WorkoutCard = ({ workout }) => {
  const { hasTierAccess, formatTierName } = useSubscription();
  const userHasAccess = hasTierAccess(workout.tier);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="relative">
        <img 
          src={workout.thumbnailUrl || '/images/placeholder-workout.jpg'} 
          alt={workout.name}
          className="w-full h-48 object-cover"
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
      
      <div className="p-4">
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
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{workout.description}</p>
        
        {userHasAccess ? (
          <Link 
            to={`/workouts/${workout.id}`} 
            className="w-full block text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
  );
};

export default WorkoutCard;
